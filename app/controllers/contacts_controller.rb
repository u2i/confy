class ContactsController < ApplicationController
  include GoogleAuthentication
  include GoogleEventClient

  before_action :refresh_token
  before_action :check_authentication

  def index
    contacts = GoogleContacts.new(session[:credentials]).call
    if contacts.present?
      render json: contacts.users.to_json
    else
      render json: {error: 'Google Server Error'}, status: :not_found
    end
  end
end
