module Admin
  class ApplicationController < ActionController::Base
    layout 'admin'

    before_action :basic_authentication

    def basic_authentication
      credentials = {
        test: { username: 'confy-admin', password: '47dc842071d09a6fed87056ff4b4fd5a' },
        prod: { username: 'confy-admin', password: 'bff2404709f2d110ca9da4cfe6fd7d55' }
      }
      env = Rails.env.test? ? :test : :prod
      authenticate_or_request_with_http_basic('Confy Admin Panel') do |username, password|
        md5_of_password = Digest::MD5.hexdigest(password)
        username == credentials[env][:username] && md5_of_password == credentials[env][:password]
      end
    end
  end
end
