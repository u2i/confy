module Api
  class ApplicationController < ActionController::Base
    include ApplicationHelper

    before_action :check_authentication

    def check_authentication
      device_id = request.headers['HTTP_DEVICE']
      return head :unauthorized unless Device.authorized.exists?(device_id: device_id)
    end
  end
end
