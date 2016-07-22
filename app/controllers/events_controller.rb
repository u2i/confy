class EventsController < ApplicationController
  include GoogleAuthentication

  before_action :check_authentication
  before_action :refresh_token

  rescue_from Google::Apis::ServerError do
    render json: {error: 'Google Server error'}, status: :service_unavailable
  end

  rescue_from Google::Apis::ClientError, GoogleEvent::InvalidParamsError do |exception|
    error_data = {error: exception.message}
    case params[:action]
    when 'create'
      render json: error_data, status: :unprocessable_entity
    when 'destroy'
      render json: error_data, status: :forbidden
    else
      render json: error_data, status: :bad_request
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
    conference_room_id = event_params[:conference_room_id]
    google_event_params = GoogleEvent.process_params(event_params)
    data = GoogleEvent.create(session[:credentials], conference_room_id, google_event_params)
    render json: data.to_json, status: :created
  end

  def destroy
    event_id = params[:id]
    GoogleEvent.delete(session[:credentials], event_id)
    redirect_to root_path
  end
  
  private

  def event_params
    params.require(:event).permit(:summary, :description, :location, :start_time, :end_time, :conference_room_id)
  end
end
