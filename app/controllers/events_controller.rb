class EventsController < ApplicationController
  include GoogleAuthentication

  before_action :refresh_token
  before_action :check_authentication

  rescue_from Google::Apis::ServerError do
    render json: {error: 'Google Server error'}, status: :service_unavailable
  end

  rescue_from Google::Apis::ClientError, GoogleCalendar::Adding::AddEventInvalidParamsError do |exception|
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

  rescue_from GoogleCalendar::Adding::AddEventInvalidRoom do |exception|
    render json: exception.message, status: :unprocessable_entity
  end

  rescue_from Google::Apis::AuthorizationError do
    session.delete(:credentials)
    render json: {error: 'Authorization error'}, status: :unauthorized
  end

  rescue_from GoogleCalendar::Adding::AddEventInTimeSpanError do |message|
    render json: {conference_room_id: [message]}, status: :unprocessable_entity
  end

  def index
    render json: GoogleEventLister.new(session[:credentials], session[:email]).call(TimeInterval.week(date_param))
  end

  def create
    conference_room_id = event_params[:conference_room_id]
    google_event_params = GoogleCalendar::GoogleEvent.process_params(event_params)
    data = GoogleCalendar::GoogleEvent.create(session[:credentials], conference_room_id, google_event_params)
    render json: data.to_json, status: :created
  end

  def destroy
    event_id = params[:id]
    GoogleCalendar::GoogleEvent.delete(session[:credentials], event_id)
    head :ok
  end

  private

  def event_params
    params.require(:event).permit(:summary, :description, :location, :start_time, :end_time, :conference_room_id)
  end

  def date_param
    params[:date] ? Date.parse(params[:date]) : Date.today
  end
end
