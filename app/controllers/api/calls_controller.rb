module Api
  class CallsController < Api::ApplicationController
    def create
      @call = ::Call.find_or_initialize_by(link: params[:link])

      if @call.save
        render json: @call.to_json, status: :ok
      else
        render json: @call.errors, status: :unprocessable_entity
      end
    end
  end
end
