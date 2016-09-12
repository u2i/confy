module GoogleCalendar
  class EventEditor
    def initialize(credentials)
      @credentials = credentials
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
    end

    def finish(conference_room_id, event_id)
      conference_room_email = ConferenceRoom.find(conference_room_id).email
      event = get_event(event_id, conference_room_email)
      finish_event(event, conference_room_email)
    end

    private

    attr_accessor :event_id, :calendar_service, :conference_room_email, :event

    def get_event(event_id, conference_room_email)
      calendar_service.get_event(conference_room_email, event_id)
    end

    def finish_event(event, conference_room_email)
      return if event_not_started?(event) || event_finished?(event)
      event.end.date_time = current_time
      update_event(event, conference_room_email)
    end

    def event_not_started?(event)
      event.start.date_time > current_time
    end

    def event_finished?(event)
      event.end.date_time < current_time
    end

    def current_time
      DateTime.now
    end

    def update_event(event, conference_room_email)
      calendar_service.update_event(conference_room_email, event.id, event)
    end
  end
end
