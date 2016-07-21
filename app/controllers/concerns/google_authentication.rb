module GoogleAuthentication
  extend ActiveSupport::Concern

  def refresh_token
    session[:credentials] = GoogleOauth.refresh_token(session[:credentials]) if session[:credentials]
  end

  def check_authentication
    return redirect_to oauth2callback_path unless session[:credentials]
    redirect_to oauth2callback_path unless GoogleOauth.authenticated?(JSON.parse(session[:credentials]))
  end
end
