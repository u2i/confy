module GoogleCalendar
  class EventFinder
    GOOGLE_EVENT_DECLINED_RESPONSE = 'declined'.freeze
    LISTING_FIELDS = 'items(id, start, end, summary, recurrence, creator, attendees(self, responseStatus))'.freeze

    def initialize(credentials, user_email)
      @credentials = credentials
      @user_email = user_email
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
    end

    def list_events(starting, ending)
      all_events = []
      listing_configuration = listing_options(starting, ending)
      calendar_service.batch do |service|
        rooms.each do |room|
          add_events_from_room(room, service, all_events, listing_configuration)
        end
      end
      mark_user_events(all_events)
      all_events
    end

    private

    def rooms
      ConferenceRoom.all
    end

    def mark_user_events(all_events)
      all_events.each do |event|
        event[:creator][:self] = (user_email == event[:creator][:email])
      end
    end

    def listing_options(starting, ending)
      {fields: LISTING_FIELDS, single_events: true, time_min: starting.rfc3339(9),
       time_max: ending.rfc3339(9), time_zone: ENV.fetch('TZ'),
       always_include_email: true}.freeze
    end

    def add_events_from_room(room, service, events, config)
      service.list_events(room.email, config) do |result, _|
        if result
          result.items.each do |event|
            next if event_declined?(event)
            GoogleCalendar::EventDataService.normalize_event_datetime(event)
            events << event.to_h.merge(additional_properties(event, room))
          end
        end
      end
    end

    def additional_properties(event, room)
      {
        conference_room: room,
        start_timestamp: event.start.date_time.to_i,
        end_timestamp: event.end.date_time.to_i
      }
    end

    # self is a field from Google::Apis::CalendarV3::EventAttendee
    def event_declined?(event)
      return false unless event.attendees.present?
      event.attendees.find(&:self).response_status == GOOGLE_EVENT_DECLINED_RESPONSE
    end

    attr_accessor :credentials, :user_email, :calendar_service
  end
end
