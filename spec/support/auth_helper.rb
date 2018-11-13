module AuthHelper
  class << self
    def http_basic_auth
      credentials = ActionController::HttpAuthentication::Basic.encode_credentials('confy-admin', 'confy-pass')
      { 'HTTP_AUTHORIZATION' => credentials }
    end

    def device_auth
      Device.find_or_create_by(device_id: 'device_id', device_name: 'test', authorized: true)
      { 'HTTP_DEVICE' => 'device_id' }
    end
  end
end
