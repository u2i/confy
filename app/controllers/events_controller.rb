class EventsController < ApplicationController
  include GoogleAuthentication
  include GoogleEventClient

  before_action :refresh_token
  before_action :check_authentication

  rescue_from Google::Apis::ServerError do
    render json: {error: 'Google Server error'}, status: :service_unavailable
  end

  rescue_from Google::Apis::ClientError, GoogleCalendar::EventCreator::EventInvalidParamsError do |error|
    error_data = {error: error.message}
    case params[:action]
    when 'create'
      render json: error_data, status: :unprocessable_entity
    when 'destroy'
      render json: error_data, status: :forbidden
    else
      render json: error_data, status: :bad_request
    end
  end

  rescue_from GoogleCalendar::EventCreator::EventInvalidRoom do |error|
    render json: error.message, status: :unprocessable_entity
  end

  rescue_from Google::Apis::AuthorizationError do
    session.delete(:credentials)
    render json: {error: 'Authorization error'}, status: :unauthorized
  end

  rescue_from GoogleCalendar::EventCreator::EventInTimeSpanError do |message|
    render json: {conference_room_id: [message]}, status: :unprocessable_entity
  end

  def index
    events = google_event_client.all(time_interval_rfc3339)
    render json: events
  end

  def room_index
    events = google_event_client.find_by_room(time_interval_rfc3339, params[:conference_room_id].to_i)
    render json: events
  end

  def create
    conference_room_id = create_event_params[:conference_room_id]
    google_event_params = GoogleCalendar::EventDataService.process_params(create_event_params)
    data = google_event_client.create(conference_room_id, google_event_params)
    render json: data.to_json, status: :created
  end

  def destroy
    event_id = params[:id]
    google_event_client.delete(event_id)
    head :ok
  end

  def confirm
    Event.confirm_or_create(edit_event_params[:conference_room_id], edit_event_params[:event_id])
    head :ok
  end

  def finish
    google_event_client.finish(edit_event_params[:conference_room_id], edit_event_params[:event_id])
    head :ok
  rescue ActiveRecord::RecordNotFound
    head :bad_request
  end

  private

  def edit_event_params
    params.permit(:conference_room_id, :event_id)
  end

  def create_event_params
    params.require(:event).permit(:summary, :description, :location, :start_time, :end_time, :conference_room_id,
                                  attendees: [:email])
  end

  def date_param
    Date.parse(params[:date])
  rescue
    Date.today
  end

  def span_param
    TimeInterval.new(Time.parse(params[:start]), Time.parse(params[:end]))
  rescue
    TimeInterval.week(date_param)
  end

  def time_interval_rfc3339
    span_param.to_rfc3339
  end
end
