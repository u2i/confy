module Api
  class ApplicationController < ActionController::Base
    include ApplicationHelper

    before_action :device_authentication

    def device_authentication
      device_id = request.headers['HTTP_DEVICE']
      device = Device.authorized.find_by(device_id: device_id)

      return head :unauthorized unless device

      device.touch
      device.save
    end
  end
end
