module Api
  class CallsController < Api::ApplicationController
    def create
      @call = ::Call.find_or_initialize_by(link: call_params[:link])
      @call.assign_attributes(call_params)

      if @call.save
        NotifyCallsJob.perform_later(params[:conference_room_id], @call.link)

        render json: @call.to_json, status: :ok
      else
        render json: @call.errors, status: :unprocessable_entity
      end
    end

    private

    def call_params
      params.require(:call).permit(:event_id, :link, :active)
    end
  end
end
