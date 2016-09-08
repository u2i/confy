module GoogleAuthentication
  extend ActiveSupport::Concern

  def refresh_token
    clear_credentials unless refresh_token_present?
    if user_credentials && GoogleOauth.need_to_refresh_token?(user_credentials)
      update_credentials
      update_user_email
    end
  rescue Signet::AuthorizationError
    clear_credentials
  end

  def clear_credentials
    session.delete(:credentials)
  end

  def refresh_token_present?
    user_credentials && JSON.parse(user_credentials)['refresh_token'].present?
  end

  def user_credentials
    session[:credentials]
  end

  def update_credentials
    session[:credentials] = GoogleOauth.refresh_token(user_credentials)
  end

  def update_user_email
    session[:email] = GoogleOauth.user_email(user_credentials)
  end


  def check_authentication
    return authentication_redirection unless user_credentials
    authentication_redirection unless GoogleOauth.authenticated?(JSON.parse(user_credentials))
  end

  def authentication_redirection
    redirect_to oauth2callback_path
  end

end
