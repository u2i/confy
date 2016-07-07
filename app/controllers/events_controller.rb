class EventsController < ApplicationController

  def create
    event = Event.new(event_params)
    if event.save
      render json: event, status: :created
    else
      render json: event.errors, status: :unprocessable_entity
    end
  end

  private

  def event_params
    params.require(:event).permit(:description, :location, :start_time, :end_time, :user, :conference_room_id)
  end

end
