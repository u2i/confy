class ConferenceRoomsController < ApplicationController
  include GoogleAuthentication
  include GoogleEventClient

  before_action :refresh_token
  before_action :check_authentication

  def show
    create_props
  end

  private

  def create_props
    current_event, next_event = events
    @props = { current_event: current_event, next_event: next_event, conference_room: conference_room }.compact
  end

  def events
    events = google_event_client.find_by_room(current_time, [conference_room.id])
    id = events.find_index { |e| e[:start][:date_time] <= current_time.starting }
    return [nil, events.first] unless id
    [events[id], events[id + 1]]
  end

  def current_time
    TimeInterval.new(Time.now, Time.now.end_of_day).to_rfc3339
  end

  def conference_room
    @conference_room ||= ConferenceRoom.find_by!(title: params[:title].titleize)
  end
end
