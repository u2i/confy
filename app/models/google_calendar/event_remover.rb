module GoogleCalendar
  class EventRemover
    include GoogleErrorHandler

    def initialize(calendar_service)
      @calendar_service = calendar_service
    end

    def delete(event_id)
      rescue_google_request { calendar_service.delete_event('primary', event_id, send_notifications: true) }
    end

    private

    attr_accessor :calendar_service
  end
end
