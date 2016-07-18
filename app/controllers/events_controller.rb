class EventsController < ApplicationController

  def index
    render json: Event.in_week_group_by_weekday(Date.parse(params[:date]))
  end

  def create
    params = event_params
    conference_room_ids = [params[:conference_room_id]]
    params = GoogleEvent.format_params(params)
    is_valid, data = GoogleEvent.create(session[:credentials], conference_room_ids, params)
    if is_valid
      render json: data.to_json, status: :created
    else
      render json: data.to_json, status: :unprocessable_entity
    end
  end

  def show
    @event = Event.find(params[:id])

    respond_to do |format|
      format.js { render partial: 'event', locals: { event: @event } }
    end
  rescue ActiveRecord::RecordNotFound => e
    render json: e.message, status: :not_found
  end

  private

  def event_params
    params.require(:event).permit(:summary, :description, :location, :start_time, :end_time, :conference_room_id)
  end
end
