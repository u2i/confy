class EventsController < ApplicationController
  def create
    event = Event.new(event_params)
    event.save!
    render json: event, status: :created
  rescue
    render json: event.errors, status: :unprocessable_entity
  end

  private

  def event_params
    params.require(:event).permit(:name, :description, :location, :start_time, :end_time, :user, :conference_room_id)
  end
end
