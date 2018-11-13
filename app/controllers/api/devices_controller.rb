module Api
  class DevicesController < ApplicationController
    skip_before_action :check_authentication, only: :create
    before_action :set_device, only: [:show, :update, :destroy]

    def show
    end

    def create
      @device = ::Device.find_or_initialize_by(device_params)

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
      @device = ::Device.find(params[:id])
    end

    def device_params
      params.require(:device).permit(:device_id, :device_name, :conference_room_id)
    end
  end
end
