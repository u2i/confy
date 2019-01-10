module GoogleCalendar
  class EventEditor
    include GoogleErrorHandler

    EventNotInProgressError = Class.new(StandardError)

    def initialize(calendar_service, user_email)
      @calendar_service = calendar_service
      @user_email = user_email
    end

    def update(conference_room, event_id, data)
      update_event(conference_room, event_id) do |event|
        GoogleCalendar::EventValidator.new(event, calendar_service, user_email).raise_if_occupied
        event.update(data)
      end
    end

    def finish(conference_room, event_id)
      update_event(conference_room, event_id) do |event|
        raise EventNotInProgressError unless event.in_progress?
        event.end_time = DateTime.now
      end
    end

    private

    def update_event(conference_room, event_id)
      event_wrapper = event_wrapper(event_id, conference_room)
      yield event_wrapper if block_given?
      update_event_in_google(event_wrapper)
    end

    def update_event_in_google(event_wrapper)
      rescue_google_request do
        calendar_service.update_event(event_wrapper.conference_room.email, event_wrapper.id, event_wrapper.google_event)
      end
      event_wrapper
    end

    def event_wrapper(event_id, room)
      google_event = calendar_service.get_event(room.email, event_id)
      GoogleCalendar::EventWrapper::Event.new(google_event, conference_room: room)
    end

    attr_accessor :calendar_service, :user_email
  end
end
