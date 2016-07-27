require 'google/apis/calendar_v3'
require 'google/api_client/client_secrets'

class CalendarController < ApplicationController
  include GoogleAuthentication

  before_action :check_authentication
  before_action :refresh_token
  before_action :load_dates_and_rooms, only: [:index]

  # Index for showing events from Google calendar
  def index
    @events = GoogleEvent.list_events(
      session[:credentials],
      @week_start.beginning_of_day.to_datetime,
      @week_end.end_of_day.to_datetime
    ).map do |_wday, events|
      build_blocks(events)
    end.flatten!(1)

    create_calendar_props
  rescue ArgumentError
    session.delete(:credentials)
    redirect_to oauth2callback_path
  end

  private

  def create_calendar_props
    @props = {conferenceRooms: @conference_rooms, events: @events, days: @days, times: @times, unitEventLength: CalendarHelper::UNIT_EVENT_LENGTH}
  end

  def load_dates_and_rooms
    @week_start, @week_end = build_week_boundaries
    @days = (@week_start..@week_end).to_a
    start_time = Time.now.at_beginning_of_day
    end_time = Time.now.at_end_of_day
    @times = time_interval(start_time, end_time, 30.minutes)
    @conference_rooms = ConferenceRoom.all
  end

  def time_interval(start_time, end_time, step)
    (start_time.to_i..end_time.to_i).step(step).collect { |time| Time.at time }
  end

  def week_start
    params[:date].present? ? Date.parse(params[:date]).beginning_of_week : Date.today.beginning_of_week
  end

  def build_week_boundaries
    week_end = week_start + CalendarHelper::WEEK_LENGTH - 1
    [week_start, week_end]
  end

  def build_blocks(events)
    EventGrouper.new(events.sort_by! { |e| e[:end][:date_time] }).call
  end
end
