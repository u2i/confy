require 'google/apis/calendar_v3'
require 'google/api_client/client_secrets'

include Rails.application.routes.url_helpers

module GoogleOauth
  CLIENT_SECRETS = Google::APIClient::ClientSecrets.load('client_secrets.json')

  module_function

  def is_authenticated?(credentials = {})
    return false unless Hash === credentials
    credentials.key?('client_id') && credentials.key?('client_secret')
  end

  def refresh_token(credentials = {})
    auth_client = Signet::OAuth2::Client.new(JSON.parse(credentials))
    if auth_client.refresh_token && auth_client.expired?
      auth_client.fetch_access_token!
      credentials = auth_client.to_json
    end
    credentials
  end

  def default_client
    CLIENT_SECRETS.to_authorization.tap do |auth_client|
      auth_client.update!(
        scope: 'https://www.googleapis.com/auth/calendar',
        redirect_uri: (url_for action: :authenticate, controller: :calendar, host: ENV['HOSTNAME'])
      )
    end
  end

  def request_code_uri
    default_client.authorization_uri.to_s
  end

  def get_user_credentials(code)
    default_client.tap do |auth_client|
      auth_client.code = code
      auth_client.fetch_access_token!
    end.to_json
  end
end
