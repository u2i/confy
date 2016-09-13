module GoogleCalendar
  class EventEditor
    def initialize(credentials)
      @credentials = credentials
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
    end

    def finish(conference_room_id, event_id)
      conference_room_email = ConferenceRoom.find(conference_room_id).email
      event_wrapper = get_event_wrapper(event_id, conference_room_email)
      finish_event(event_wrapper, conference_room_email)
    end

    private

    attr_accessor :event_id, :calendar_service, :conference_room_email, :event

    def get_event_wrapper(event_id, conference_room_email)
      google_event = calendar_service.get_event(conference_room_email, event_id)
      GoogleCalendar::EventWrapper::Event.new(google_event)
    end

    def finish_event(event_wrapper, conference_room_email)
      return unless event_wrapper.in_progress?
      event_wrapper.finish
      update_event(event_wrapper, conference_room_email)
    end

    def update_event(event_wrapper, conference_room_email)
      event = event_wrapper.google_event
      calendar_service.update_event(conference_room_email, event.id, event)
    end
  end
end
