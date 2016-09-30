module GoogleCalendar
  class EventFinder
    include GoogleErrorHandler

    GOOGLE_EVENT_DECLINED_RESPONSE = 'declined'.freeze
    LISTING_FIELDS = 'items(id, start, end, summary, description, recurrence, '\
                     'creator, attendees(self, responseStatus, displayName, email), hangoutLink, htmlLink)'.freeze
    USER_FIELDS = 'items(id, creator, htmlLink)'.freeze

    def initialize(credentials)
      @credentials = credentials
      @client = GoogleCalendar::Client.new(credentials)
    end

    def all(time_interval)
      list_events(time_interval, rooms)
    end

    def confirmed_events(time_interval)
      all_google_events = all(time_interval)
      confirmed_ids = Event.confirmed_event_ids
      all_google_events.select { |event| confirmed_ids.include?(event[:id]) }
    end

    def by_room(time_interval, conference_room_ids, with_confirmation = false)
      events = list_events(time_interval, rooms(conference_room_ids))
      include_confirmation(events) if with_confirmation
      events
    end

    private

    def calendar_service
      client.calendar_service
    end

    def list_events(time_interval, rooms)
      listing_configuration = listing_options(time_interval, LISTING_FIELDS)
      rescue_google_request do
        calendar_service.batch do |service|
          rooms.each do |room|
            add_events_from_room(room, service, listing_configuration)
          end
        end
      end
      merge_events(all_events, user_events(time_interval)).map(&:to_h)
    end

    def user_events(time_interval)
      listing_configuration = listing_options(time_interval, USER_FIELDS)
      calendar_service.list_events('primary', listing_configuration).items
    end

    def merge_events(room_events, user_events)
      room_events.each do |event|
        user_event = user_events.select { |e| e.id == event.id }.first
        next unless user_event.present?
        event.update(user_event.to_h)
      end
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

    def listing_options(time_interval, fields)
      {fields: fields, single_events: true, time_min: time_interval.starting,
       time_max: time_interval.ending, time_zone: ENV.fetch('TZ'),
       always_include_email: true}.freeze
    end

    def add_events_from_room(room, service, config)
      service.list_events(room.email, config) do |result, _|
        if result
          result.items.each do |google_event|
            next if event_declined?(google_event)
            all_events << rounded_event_wrapper(google_event, room)
          end
        end
      end
    end

    # self is a field from Google::Apis::CalendarV3::EventAttendee
    def event_declined?(event)
      return false unless event.attendees.present?
      event.attendees.find(&:self).response_status == GOOGLE_EVENT_DECLINED_RESPONSE
    end

    def rounded_event_wrapper(google_event, conference_room)
      GoogleCalendar::EventWrapper::RoundedEvent.new(google_event, conference_room)
    end

    attr_accessor :credentials, :client
  end
end
