module AuthHelper
  class << self
    def http_basic_auth
      credentials = ActionController::HttpAuthentication::Basic.encode_credentials('confy-admin', 'confy-pass')
      { 'HTTP_AUTHORIZATION' => credentials }
    end
  end
end
