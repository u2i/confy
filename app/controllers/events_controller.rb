class EventsController < ApplicationController
  include GoogleAuthentication
  include GoogleEventClient

  before_action :refresh_token
  before_action :check_authentication

  rescue_from Google::Apis::ServerError do
    render json: {error: 'Google Server error'}, status: :service_unavailable
  end

  rescue_from Google::Apis::ClientError, GoogleCalendar::EventValidator::EventInvalidParamsError do |error|
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

  rescue_from ActiveRecord::RecordNotFound do |error|
    render json: error.message, status: :unprocessable_entity
  end

  rescue_from Google::Apis::AuthorizationError do
    session.delete(:credentials)
    render json: {error: 'Authorization error'}, status: :unauthorized
  end

  rescue_from GoogleCalendar::EventValidator::EventInTimeSpanError do |message|
    render json: {conference_room_id: [message]}, status: :unprocessable_entity
  end

  rescue_from ActionController::ParameterMissing do |message|
    render json: {missing_key: message}, status: :unprocessable_entity
  end

  def index
    events = google_event_client.all(span_param.to_rfc3339)
    render json: events
  end

  def room_index
    events = google_event_client.find_by_room(
      span_param.to_rfc3339,
      params[:id].to_i,
      with_confirmation?
    )
    render json: events
  end

  def create
    event_params = create_event_params
    data = google_event_client.create(event_params.to_h).to_h
    conference_room = ConferenceRoom.find(event_params[:conference_room_id])
    data[:confirmed] = Event.confirm_or_create(conference_room, data[:id]) if event_params[:confirmed].present?
    data[:conference_room] = conference_room
    render json: data, status: :created
  end

  def destroy
    event_id = params[:id]
    google_event_client.delete(event_id)
    head :ok
  end

  def confirm
    Event.confirm_or_create(conference_room, params[:event_id])
    head :ok
  end

  def finish
    google_event_client.finish(conference_room, params[:event_id])
    head :ok
  rescue GoogleCalendar::EventEditor::EventNotInProgressError
    head :bad_request
  end

  def confirmed
    @confirmed_events = google_event_client.confirmed_events(TimeInterval.since_first_confirmed_event.to_rfc3339)
  end

  def update
    event = google_event_client.update(conference_room, params[:event_id], edit_event_params)
    confirmed = ::Event.google_event_confirmed?(event)
    render json: event.to_h.merge(confirmed: confirmed)
  end

  private

  def with_confirmation?
    params[:confirmation] == 'true'.freeze
  end

  def create_event_params
    params.require(:event).permit(:summary, :description, :location, :start_time, :end_time, :conference_room_id,
                                  :confirmed, :recurrence, attendees: [:email])
  end

  def edit_event_params
    params.require(:event).permit(:summary, :description, :start_time, :end_time)
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

  def conference_room
    ConferenceRoom.find(params[:conference_room_id])
  end
end
