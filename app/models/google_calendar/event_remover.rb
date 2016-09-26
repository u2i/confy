module GoogleCalendar
  class EventRemover
    include GoogleErrorHandler

    def initialize(credentials)
      @credentials = credentials
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
    end

    def delete(event_id)
      rescue_google_request { calendar_service.delete_event('primary', event_id, send_notifications: true) }
    end

    private

    attr_accessor :credentials, :calendar_service
  end
end
