class AuthenticationController < ApplicationController
  def authenticate
    session[:credentials] = GoogleOauth.get_user_credentials(params[:code])
    redirect_to root_path
  rescue
    session.delete(:credentials)
    redirect_to GoogleOauth.request_code_uri
  end
end
