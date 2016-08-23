class ContactsController < ApplicationController
  include GoogleAuthentication
  include GoogleEventClient

  before_action :refresh_token
  before_action :check_authentication

  def index
    contacts = GoogleContacts.new(session[:credentials]).call
    render json: contacts.users.to_json
  rescue Google::Apis::ServerError
    render json: {error: 'Google Server Error'}, status: :not_found
  end
end
