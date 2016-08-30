module GoogleAuthentication
  extend ActiveSupport::Concern

  included do
    rescue_from ArgumentError do
      session.delete(:credentials)
      redirect_action
    end
  end

  def refresh_token
    credentials = session[:credentials]
    if credentials && GoogleOauth.need_to_refresh_token?(credentials)
      session[:credentials] = GoogleOauth.refresh_token(credentials)
      session[:email] = GoogleOauth.user_email(session[:credentials])
    end
  end

  def check_authentication
    return redirect_action unless session[:credentials]
    redirect_action unless GoogleOauth.authenticated?(JSON.parse(session[:credentials]))
  end

  private

  def redirect_action
    session[:redirect_to] = request.original_url
    redirect_to oauth2callback_path
  end
end
