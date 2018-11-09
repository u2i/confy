module Admin
  class ApplicationController < ActionController::Base
    layout 'admin'

    before_action :basic_authentication

    def basic_authentication
      authenticate_or_request_with_http_basic('Confy Admin Panel') do |username, password|
        username == 'confy-admin' && password == 'confy-pass'
      end
    end
  end
end
