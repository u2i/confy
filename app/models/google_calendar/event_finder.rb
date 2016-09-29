module GoogleCalendar
  class EventFinder
    include GoogleErrorHandler

    GOOGLE_EVENT_DECLINED_RESPONSE = 'declined'.freeze
    LISTING_FIELDS = 'items(id, start, end, summary, description, recurrence, '\
                     'creator, attendees(self, responseStatus, displayName, email), hangoutLink, htmlLink)'.freeze

    def initialize(credentials, user_email)
      @credentials = credentials
      @user_email = user_email
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
    end

    def all(time_interval)
      list_events(time_interval, rooms)
    end

    def confirmed_events(time_interval)
      filtered_events(time_interval) { |event| Event.confirmed_event_ids.include?(event[:id])}
    end

    def unconfirmed_events(time_interval)
      filtered_events(time_interval) { |event| !Event.confirmed_event_ids.include?(event[:id]) }
    end

    def by_room(time_interval, conference_room_ids, with_confirmation = false)
      events = list_events(time_interval, rooms(conference_room_ids))
      include_confirmation(events) if with_confirmation
      events
    end

    private

    def filtered_events(time_interval, &block)
      all_google_events = all(time_interval)
      all_google_events.select &block
    end

    def list_events(time_interval, rooms)
      listing_configuration = listing_options(time_interval)
      rescue_google_request do
        calendar_service.batch do |service|
          rooms.each do |room|
            add_events_from_room(room, service, listing_configuration)
          end
        end
      end
      all_events
    end

    def include_confirmation(events)
      confirmed_ids = confirmed_events_ids(events)
      events.each { |event| event[:confirmed] = confirmed_ids.include?(event[:id]) }
    end

    def confirmed_events_ids(events)
      Event.confirmed.where(event_id: events.map { |event| event[:id] }).pluck(:event_id)
    end

    def all_events
      @all_events ||= []
    end

    def rooms(conference_room_ids = nil)
      return ConferenceRoom.where(id: conference_room_ids) if conference_room_ids
      @rooms ||= ConferenceRoom.all
    end

    def mark_user_events(all_events)
      all_events.each do |event|
        event[:creator][:self] = (user_email == event[:creator][:email])
      end
    end

    def listing_options(time_interval)
      { fields: LISTING_FIELDS, single_events: true, time_min: time_interval.starting,
        time_max: time_interval.ending, time_zone: ENV.fetch('TZ'),
        always_include_email: true }.freeze
    end

    def add_events_from_room(room, service, config)
      service.list_events(room.email, config) do |result, _|
        if result
          result.items.each do |google_event|
            next if event_declined?(google_event)
            all_events << build_event_data(google_event, room)
          end
        end
      end
    end

    # self is a field from Google::Apis::CalendarV3::EventAttendee
    def event_declined?(event)
      return false unless event.attendees.present?
      event.attendees.find(&:self).response_status == GOOGLE_EVENT_DECLINED_RESPONSE
    end

    def build_event_data(google_event, conference_room)
      event_wrapper = rounded_event_wrapper(google_event, conference_room)
      event_wrapper.mark_user_event
      event_wrapper.to_h
    end

    def rounded_event_wrapper(google_event, conference_room)
      params = { conference_room: conference_room, user_email: user_email }
      GoogleCalendar::EventWrapper::RoundedEvent.new(google_event, params)
    end

    attr_accessor :credentials, :user_email, :calendar_service
  end
end
