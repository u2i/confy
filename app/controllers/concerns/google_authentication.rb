module GoogleAuthentication
  extend ActiveSupport::Concern

  def refresh_token
    credentials = session[:credentials]
    if credentials && GoogleOauth.need_to_refresh_token?(credentials)
      session[:credentials] = GoogleOauth.refresh_token(credentials)
      session[:email] = GoogleOauth.user_email(session[:credentials])
    end
  end

  def check_authentication
    return redirect_to oauth2callback_path unless session[:credentials]
    redirect_to oauth2callback_path unless GoogleOauth.authenticated?(JSON.parse(session[:credentials]))
  end
end
