class EventsController < ApplicationController
  include GoogleAuthentication

  before_action :check_authentication
  before_action :refresh_token

  rescue_from Google::Apis::ServerError do
    render json: {error: 'Google Server error'}, status: :service_unavailable
  end

  rescue_from Google::Apis::ClientError, GoogleEvent::InvalidParamsError do |exception|
    case params[:action]
    when 'create'
      render json: {error: exception.message}, status: :unprocessable_entity
    when 'destroy'
      render json: {error: exception.message}, status: :forbidden
    else
      render json: {error: exception.message}, status: :bad_request
    end
  end

  rescue_from Google::Apis::AuthorizationError do
    session.delete(:credentials)
    render json: {error: 'Authorization error'}, status: :unauthorized
  end

  def index
    render json: Event.in_week_group_by_weekday(Date.parse(params[:date]))
  end

  def create
    conference_room_ids = [event_params[:conference_room_id]]
    google_event_params = GoogleEvent.process_params(event_params)
    data = GoogleEvent.create(session[:credentials], conference_room_ids, google_event_params)
    render json: data.to_json, status: :created
  end

  def show
    @event = Event.find(params[:id])

    respond_to do |format|
      format.js { render partial: 'event', locals: {event: @event} }
    end
  rescue ActiveRecord::RecordNotFound => e
    render json: e.message, status: :not_found
  end

  def destroy
    event_id = params[:id]
    GoogleEvent.delete(session[:credentials], event_id)
  end

  private

  def event_params
    params.require(:event).permit(:summary, :description, :location, :start_time, :end_time, :conference_room_id)
  end
end
