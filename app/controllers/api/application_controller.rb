module Api
  class ApplicationController < ActionController::Base
    include ApplicationHelper

    before_action :device_authentication

    def device_authentication
      device_id = request.headers['HTTP_DEVICE']
      return head :unauthorized unless Device.authorized.exists?(device_id: device_id)
    end
  end
end
