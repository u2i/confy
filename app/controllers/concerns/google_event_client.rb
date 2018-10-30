module GoogleEventClient
  extend ActiveSupport::Concern

  def google_event_client
    calendar_service = GoogleCalendar::Client.new(session[:credentials]).calendar_service
    user_email = session[:email]

    GoogleCalendar::GoogleEvent.new(calendar_service: calendar_service, user_email: user_email)
  end

  def service_account_client
    calendar_service = GoogleOauth.push_notification_client
    user_email = ENV.fetch('APPLICATION_OWNER')

    GoogleCalendar::GoogleEvent.new(calendar_service: calendar_service, user_email: user_email)
  end
end
