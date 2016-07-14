class EventsController < ApplicationController

  def index
    render json: Event.in_week_group_by_weekday(Date.parse params[:date])
  end

  def create
    event = Event.new(event_params)
    event.save!
    render json: event, status: :created
  rescue
    render json: event.errors, status: :unprocessable_entity
  end

  def show
    @event = Event.find(params[:id])

    respond_to do |format|
      format.js { render partial: 'event', locals: {event: @event} }
    end
  rescue ActiveRecord::RecordNotFound => e
    render json: e.message, status: :not_found
  end

  private

  def event_params
    params.require(:event).permit(:name, :description, :location, :start_time, :end_time, :user, :conference_room_id)
  end

end
