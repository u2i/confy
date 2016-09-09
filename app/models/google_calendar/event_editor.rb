module GoogleCalendar
  class EventEditor
    def initialize(credentials)
      @credentials = credentials
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
    end

    def finish(conference_room_id, event_id)
      @conference_room_email = ConferenceRoom.find(conference_room_id).email
      @event = get_event(event_id)
      finish_event
    end

    private

    def get_event(event_id)
      calendar_service.get_event(conference_room_email, event_id)
    end

    def update_event
      calendar_service.update_event(conference_room_email, event.id, event)
    end

    def finish_event
      return if event_not_started? || event_finished?
      event.end.date_time = current_time
      update_event
    end

    def event_not_started?
      event.start.date_time > current_time
    end

    def event_finished?
      event.end.date_time < current_time
    end

    def current_time
      DateTime.now
    end

    attr_accessor :event_id, :calendar_service, :conference_room_email, :event
  end
end
