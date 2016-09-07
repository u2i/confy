module GoogleCalendar
  class EventFinder
    GOOGLE_EVENT_DECLINED_RESPONSE = 'declined'.freeze
    LISTING_FIELDS = 'items(id, start, end, summary, recurrence, '\
                     'creator, attendees(self, responseStatus, displayName, email))'.freeze

    def initialize(credentials, user_email)
      @credentials = credentials
      @user_email = user_email
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
    end

    def all(time_interval)
      list_events(time_interval, rooms)
    end

    def by_room(time_interval, conference_room_ids)
      list_events(time_interval, rooms(conference_room_ids))
    end

    private

    def list_events(time_interval, rooms)
      all_events = []
      listing_configuration = listing_options(time_interval)
      calendar_service.batch do |service|
        rooms.each do |room|
          add_events_from_room(room, service, all_events, listing_configuration)
        end
      end
      mark_user_events(all_events)
      all_events
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
      {fields: LISTING_FIELDS, single_events: true, time_min: time_interval.starting,
       time_max: time_interval.ending, time_zone: ENV.fetch('TZ'),
       always_include_email: true}.freeze
    end

    def add_events_from_room(room, service, events, config)
      service.list_events(room.email, config) do |result, _|
        if result
          result.items.each do |event|
            next if event_declined?(event)
            events << GoogleCalendar::EventDataService.with_normalized_datetime(event).merge(conference_room: room)
          end
        end
      end
    end

    # self is a field from Google::Apis::CalendarV3::EventAttendee
    def event_declined?(event)
      return false unless event.attendees.present?
      event.attendees.find(&:self).response_status == GOOGLE_EVENT_DECLINED_RESPONSE
    end

    attr_accessor :credentials, :user_email, :calendar_service
  end
end
