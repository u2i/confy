require 'google/apis/calendar_v3'
require 'google/apis/oauth2_v2'
require 'google/api_client/client_secrets'

include Rails.application.routes.url_helpers

class GoogleOauth
  CLIENT_SECRETS = Google::APIClient::ClientSecrets.new(
    YAML.load(ERB.new(File.read(Rails.root.join('config/google_secret.yml'))).result)[Rails.env]
  )
  CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar'.freeze
  EMAIL_SCOPE = 'https://www.googleapis.com/auth/userinfo.email'.freeze
  DIRECTORY_SCOPE = 'https://www.googleapis.com/auth/admin.directory.user.readonly'.freeze

  class << self
    include GoogleOauthClient

    def authenticated?(credentials = {})
      return false unless credentials.is_a?(Hash)
      credentials.key?('client_id') && credentials.key?('client_secret')
    end

    def refresh_token(credentials = {})
      auth_client = new_auth_client(credentials)
      auth_client.fetch_access_token!
      auth_client.to_json
    end

    def need_to_refresh_token?(credentials = {})
      auth_client = new_auth_client(credentials)
      auth_client.refresh_token && auth_client.expired?
    end

    def default_client
      CLIENT_SECRETS.to_authorization.tap do |auth_client|
        auth_client.update!(
          scope: [CALENDAR_SCOPE, EMAIL_SCOPE, DIRECTORY_SCOPE],
          redirect_uri: (url_for action: :authenticate, controller: :authentication, host: ENV['HOSTNAME'])
        )
      end
    end

    def request_code_uri
      default_client.authorization_uri(approval_prompt: 'force', access_type: 'offline').to_s
    end

    def get_user_credentials(code)
      default_client.tap do |auth_client|
        auth_client.code = code
        auth_client.fetch_access_token!
      end.to_json
    end

    def user_email(credentials)
      service = user_info_service(credentials)
      service.get_userinfo.email
    end

    def push_notification_client
      Google::Apis::CalendarV3::CalendarService.new.tap { |s| s.authorization = authorization_details }
    end

    def authorization_details
      Google::Auth.get_application_default([CALENDAR_SCOPE]).tap do |authorization|
        authorization.sub = ENV.fetch('APPLICATION_OWNER')
        authorization.fetch_access_token!
      end
    end

    def user_info_service(credentials)
      Google::Apis::Oauth2V2::Oauth2Service.new.tap { |s| s.authorization = new_auth_client(credentials) }
    end

    def token_info(access_token)
      service = Google::Apis::Oauth2V2::Oauth2Service.new
      service.tokeninfo(access_token: access_token)
    end
  end

  private_class_method :user_info_service, :new_auth_client, :authorization_details
end
