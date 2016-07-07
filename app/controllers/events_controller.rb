class EventsController < ApplicationController


  def new
  end

  def create
    Event.create(event_params)
    redirect_to root_path
  end

  private
  def event_params
    params.require(:event).permit(:description, :location, :start_time, :end_time, :user)
  end

end
