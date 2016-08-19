class ContactsController < ApplicationController
  include GoogleAuthentication
  include GoogleEventClient

  before_action :refresh_token
  before_action :check_authentication

  def index
    render json: users.to_json
  end

  private

  def users
    GoogleContacts.new(session[:credentials]).call.users || []
  end
end
