module GoogleAuthentication
  extend ActiveSupport::Concern

  included do
    before_action :check_authentication
    before_action :refresh_token
  end

  def refresh_token
    session[:credentials] = GoogleOauth.refresh_token(session[:credentials]) if session[:credentials]
  end

  def check_authentication
    unless session[:credentials] && GoogleOauth.authenticated?(JSON.parse(session[:credentials]))
      redirect_to oauth2callback_path
    end
  end
end