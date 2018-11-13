module Api
  class DevicesController < ApplicationController
    before_action :set_device, only: [:show, :update, :destroy]

    def show
    end

    def create
      @device = ::Device.new(device_params)
      @device.authorized = false

      if @device.save
        render json: @device.to_json, status: :ok
      else
        render json: @device.errors, status: :unprocessable_entity
      end
    end

    def update
      if @device.update(device_params)
        render json: @device.to_json, status: :ok
      else
        render json: @device.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @device.destroy
      head :no_content
    end

    private

    def set_device
      @device = ::Device.find(params[:device_id])
    end

    def device_params
      params.require(:device).permit(:device_id, :device_name, :conference_room_id)
    end
  end
end
