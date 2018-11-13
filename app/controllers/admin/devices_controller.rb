module Admin
  class DevicesController < Admin::ApplicationController
    before_action :set_admin_device, only: [:edit, :update, :destroy]

    def index
      @devices = ::Device.all
    end

    def edit
    end

    def update
      if @device.update(device_params)
        redirect_to admin_devices_url, notice: 'Device was successfully updated.'
      else
        render :edit
      end
    end

    def destroy
      @device.destroy
      redirect_to admin_devices_url, notice: 'Device was successfully destroyed.'
    end

    private

    def set_admin_device
      @device = ::Device.find(params[:id])
    end

    def device_params
      params.require(:device).permit(:device_id, :device_name, :conference_room_id, :authorized)
    end
  end
end
