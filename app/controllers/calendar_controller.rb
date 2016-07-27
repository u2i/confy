require 'google/apis/calendar_v3'
require 'google/api_client/client_secrets'

class CalendarController < ApplicationController
  include GoogleAuthentication
  include GoogleEventListing
  include TimeInterval

  before_action :refresh_token
  before_action :check_authentication
  before_action :load_dates_and_rooms, only: [:index]

  # Index for showing events from Google calendar
  def index
    @events = list_events(@week_start, @week_end)
    create_calendar_props
  rescue ArgumentError
    session.delete(:credentials)
    redirect_to oauth2callback_path
  end

  private

  def create_calendar_props
    @props = {conferenceRooms: @conference_rooms,
              initialEvents: @events,
              days: @days,
              times: @times,
              unitEventLength: EventGrouper::GRANULARITY}
  end

  def load_dates_and_rooms
    @week_start, @week_end = build_week_boundaries(params[:date])
    @days = (@week_start..@week_end).to_a
    start_time = Time.now.at_beginning_of_day
    end_time = Time.now.at_end_of_day
    @times = time_interval(start_time, end_time, 30.minutes)
    @conference_rooms = ConferenceRoom.all
  end
end
