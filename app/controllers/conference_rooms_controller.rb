class ConferenceRoomsController < ApplicationController
  include GoogleAuthentication
  include GoogleEventClient

  before_action :refresh_token
  before_action :check_authentication

  before_action :fetch_event

  def show

  end

  private

  def fetch_event
    @event = google_event_client.find_by_room(current_time, [conference_room.id]).first
  end

  def current_time
    TimeInterval.new(Time.now, Time.now + 1.minute).to_rfc3339
  end

  def conference_room
    ConferenceRoom.find_by!(title: params[:title].titleize)
  end
end
