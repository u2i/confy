module GoogleCalendar
  class EventRemover

    def initialize(credentials)
      @credentials = credentials
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
    end

    def delete(event_id)
      calendar_service.delete_event('primary', event_id)
    end

    private

    attr_accessor :credentials, :calendar_service
  end
end
