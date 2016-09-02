module GoogleCalendar
  class EventCreator
    EventInvalidParamsError = Class.new(StandardError)
    EventInTimeSpanError = Class.new(StandardError)

    def initialize(credentials, user_email)
      @credentials = credentials
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
      @user_email = user_email
    end

    def create(event_data = {})
      event_data.merge!(user_email: user_email)
      event_wrapper = build_event_wrapper(event_data)
      insert_event_and_return_result(event_wrapper)
    end

    private

    def insert_event_and_return_result(event_wrapper)
      raise_error_if_occupied(event_wrapper)
      google_event = event_wrapper.as_google_event
      calendar_service.insert_event('primary', google_event, send_notifications: true)
    end

    def raise_error_if_occupied(event_wrapper)
      events = events_in_span(event_wrapper.conference_room, event_wrapper.start_time.date_time, event_wrapper.end_time.date_time)
      return unless events.any?
      error_message = occupied_error_message(events)
      raise(EventInTimeSpanError, error_message)
    end

    def occupied_error_message(events)
      "Already #{events.count} #{'event'.pluralize(events.count)} in time span(#{items_list(events)})."
    end

    def items_list(items)
      items.map(&:summary).join(', '.freeze)
    end

    def build_event_wrapper(event_data)
      event_wrapper = GoogleCalendar::EventWrapper::Event.new(event_data)
      raise_error_if_invalid(event_wrapper)
      event_wrapper
    end

    def raise_error_if_invalid(event)
      error_message = 'invalid event attributes'
      raise EventInvalidParamsError, error_message unless event.valid?
    end

    def events_in_span(conference_room, starting, ending)
      return [] unless conference_room
      events = calendar_service.list_events(
        conference_room.email,
        time_min: starting.to_s,
        time_max: ending.to_s
      )
      events ? events.items : []
    end

    attr_accessor :credentials, :calendar_service, :user_email
  end
end
