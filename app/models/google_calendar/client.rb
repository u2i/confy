module GoogleCalendar
  class Client

    def initialize(credentials)
      @credentials = credentials
    end

    def calendar_service
      Google::Apis::CalendarV3::CalendarService.new.tap { |s| s.authorization = client }
    end

    private

    attr_accessor :credentials

    def client
      Signet::OAuth2::Client.new(JSON.parse(credentials))
    end
  end
end
