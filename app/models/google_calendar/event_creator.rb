module GoogleCalendar
  class EventCreator
    include GoogleErrorHandler

    def initialize(credentials, user_email)
      @credentials = credentials
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
      @user_email = user_email
    end

    def create(data = {})
      data[:user_email] = user_email
      insert_event(data)
    end

    private

    def insert_event(data)
      event_wrapper(data).tap do |event_wrapper|
        validate_event(event_wrapper)
        rescue_google_request do
          calendar_service.insert_event('primary', event_wrapper.google_event, send_notifications: true)
        end
      end
    end

    def event_wrapper(data)
      GoogleCalendar::EventWrapper::Builder.new(data).build_event_wrapper
    end

    def validate_event(wrapper)
      GoogleCalendar::EventValidator.new(wrapper, credentials, user_email).raise_if_invalid
    end

    attr_accessor :credentials, :calendar_service, :user_email
  end
end
