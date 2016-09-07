module GoogleCalendar
  class EventFinder
    GOOGLE_EVENT_DECLINED_RESPONSE = 'declined'.freeze
    LISTING_FIELDS = 'items(id, start, end, summary, recurrence, creator, attendees(self, responseStatus))'.freeze

    def initialize(credentials, user_email)
      @credentials = credentials
      @user_email = user_email
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
    end

    def by_room(time_interval, conference_room_ids)
      list_events(time_interval, rooms(conference_room_ids))
    end

    def all(time_interval)
      list_events(time_interval, rooms)
    end

    private

    def rooms(conference_room_ids = nil)
      return ConferenceRoom.where(id: conference_room_ids) unless conference_room_ids.nil?
      @rooms ||= ConferenceRoom.all
    end

    def list_events(time_interval, rooms)
      listing_configuration = listing_options(time_interval)
      calendar_service.batch do |service|
        rooms.each do |room|
          add_events_from_room(room, service, listing_configuration)
        end
      end
      all_events
    end

    def all_events
      @all_events ||= []
    end

    def listing_options(time_interval)
      {fields: LISTING_FIELDS, single_events: true, time_min: time_interval.starting,
       time_max: time_interval.ending, time_zone: ENV.fetch('TZ'),
       always_include_email: true}.freeze
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
      event_wrapper.mark_user_event(user_email)
      event_wrapper.to_h
    end

    def rounded_event_wrapper(google_event, conference_room)
      GoogleCalendar::EventWrapper::Builder.new(google_event, conference_room).build_rounded_event_wrapper
    end

    attr_accessor :credentials, :user_email, :calendar_service
  end
end
