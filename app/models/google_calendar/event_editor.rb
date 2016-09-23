module GoogleCalendar
  class EventEditor
    EventNotInProgressError = Class.new(StandardError)

    def initialize(credentials)
      @credentials = credentials
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
    end

    def update(conference_room_id, event_id, data)
      update_event(conference_room_id, event_id) do |event|
        event.update(data)
      end
    end

    def finish(conference_room_id, event_id)
      update_event(conference_room_id, event_id) do |event|
        raise EventNotInProgressError unless event.in_progress?
        event.end_time = DateTime.now
      end
    end

    private

    attr_accessor :calendar_service

    def update_event(conference_room_id, event_id)
      email = conference_room_email(conference_room_id)
      event_wrapper = event_wrapper(event_id, email)
      yield event_wrapper if block_given?
      update_event_in_google(event_wrapper, email)
    end

    def conference_room_email(conference_room_id)
      ConferenceRoom.find(conference_room_id).email
    end

    def event_wrapper(event_id, conference_room_email)
      google_event = calendar_service.get_event(conference_room_email, event_id)
      GoogleCalendar::EventWrapper::Event.new(google_event)
    end

    def update_event_in_google(event_wrapper, conference_room_email)
      event = event_wrapper.google_event
      calendar_service.update_event(conference_room_email, event.id, event)
    end
  end
end
