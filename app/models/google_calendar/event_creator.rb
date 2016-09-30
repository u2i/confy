module GoogleCalendar
  class EventCreator
    include GoogleErrorHandler

    EventInvalidParamsError = Class.new(StandardError)
    EventInTimeSpanError = Class.new(StandardError)

    def initialize(client, user_email)
      @calendar_service = client
      @user_email = user_email
    end

    def create(event_data = {})
      event_data[:user_email] = user_email
      event_wrapper = build_event_wrapper(event_data)
      insert_event_and_return_result(event_wrapper)
    end

    private

    def insert_event_and_return_result(event_wrapper)
      raise_error_if_occupied(event_wrapper)
      google_event = event_wrapper.google_event
      rescue_google_request do
        calendar_service.insert_event('primary', google_event, send_notifications: true)
      end
    end

    def raise_error_if_occupied(wrapper)
      events = events_in_span(wrapper)
      return unless events.any?
      error_message = occupied_error_message(events)
      raise(EventInTimeSpanError, error_message)
    end

    def occupied_error_message(events)
      "Already #{events.count} #{'event'.pluralize(events.count)} in time span(#{items_list(events)})."
    end

    def items_list(items)
      items.map { |item| item[:summary] }.join(', '.freeze)
    end

    def build_event_wrapper(event_data)
      event_wrapper = GoogleCalendar::EventWrapper::Builder.new(event_data).build_event_wrapper
      raise_error_if_invalid(event_wrapper)
      event_wrapper
    end

    def raise_error_if_invalid(event)
      error_message = 'invalid event attributes'
      raise EventInvalidParamsError, error_message unless event.valid?
    end

    def events_in_span(wrapper)
      return [] unless wrapper.conference_room
      event_interval = TimeInterval.new(wrapper.start.date_time, wrapper.end.date_time).to_rfc3339
      GoogleCalendar::EventFinder.new(credentials, user_email).by_room(event_interval, wrapper.conference_room.id)
    end

    attr_accessor :credentials, :calendar_service, :user_email
  end
end
