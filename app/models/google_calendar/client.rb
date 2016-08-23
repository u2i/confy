module GoogleCalendar
  class Client
    def initialize(credentials)
      @credentials = credentials
    end

    def calendar_service
      Google::Apis::CalendarV3::CalendarService.new.tap { |s| s.authorization = new_auth_client }
    end

    private

    include GoogleOauthClient

    attr_accessor :credentials
  end
end
