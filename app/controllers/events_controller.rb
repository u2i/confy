class EventsController < ApplicationController
  include GoogleAuthentication

  before_action :check_authentication
  before_action :refresh_token

  def index
    render json: Event.in_week_group_by_weekday(Date.parse(params[:date]))
  end

  def create
    event = Event.create!(event_params)
    render json: event, status: :created
  rescue ActiveRecord::RecordInvalid => invalid
    render json: invalid.record.errors, status: :unprocessable_entity
  end

  private

  def event_params
    params.require(:event).permit(:name, :description, :location, :start_time, :end_time, :user, :conference_room_id)
  end
end
