module GoogleEventClient
  extend ActiveSupport::Concern

  def google_event_client
    GoogleCalendar::GoogleEvent.new(session[:credentials])
  end
end
