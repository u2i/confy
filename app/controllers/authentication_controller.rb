class AuthenticationController < ApplicationController
  def authenticate
    set_session
    redirect_to redirect_path
  rescue
    session.delete(:email)
    session.delete(:credentials)
    redirect_to GoogleOauth.request_code_uri
  end

  private

  def redirect_path
    session.delete(:redirect_to) || root_path
  end

  def set_session
    session[:credentials] = GoogleOauth.get_user_credentials(params[:code])
    session[:email] = GoogleOauth.user_email(session[:credentials])
  end
end
