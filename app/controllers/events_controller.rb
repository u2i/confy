class EventsController < ApplicationController

  rescue_from Google::Apis::ServerError do
    render json: 'Google Server error', status: :service_unavailable
  end

  rescue_from Google::Apis::ClientError, GoogleEvent::InvalidParamsException do |exception|
    render json: exception.message, status: :unprocessable_entity
  end

  rescue_from Google::Apis::AuthorizationError do
    session.delete(:credentials)
    render json: 'Authorization error', status: :unauthorized
  end


  def index
    render json: Event.in_week_group_by_weekday(Date.parse(params[:date]))
  end

  def create
    conference_room_ids = [event_params[:conference_room_id]]
    google_event_params = GoogleEvent.format_params(event_params)
    data = GoogleEvent.create(session[:credentials], conference_room_ids, google_event_params)
    render json: data.to_json, status: :created
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