module GoogleCalendar
  class EventCreator
    include GoogleErrorHandler

    def initialize(credentials)
      @credentials = credentials
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
    end

    def create(data = {})
      insert_event(data)
    end

    private

    def insert_event(data)
      event_wrapper = event_wrapper(data)
      validate_event(event_wrapper)
      rescue_google_request do
        calendar_service.insert_event('primary', event_wrapper.google_event, send_notifications: true)
      end
    end

    def event_wrapper(data)
      GoogleCalendar::EventWrapper::Builder.new(data).build_event_wrapper
    end

    def validate_event(wrapper)
      GoogleCalendar::EventValidator.new(wrapper, credentials).raise_if_invalid
    end

    attr_accessor :credentials, :calendar_service
  end
end
