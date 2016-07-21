require 'google/apis/calendar_v3'
require 'google/api_client/client_secrets'

class CalendarController < ApplicationController
  include GoogleAuthentication

  before_action :check_authentication
  before_action :refresh_token
  before_action :load_dates_and_rooms, only: [:index, :google_index]

  def index
    @events = EventGrouper.new(Event.in_week(week_start)).call
  end

  # Index for showing events from Google calendar
  def google_index
    @events = EventGrouper.new(
      GoogleEvent.list_events(session[:credentials], DateTime.now.beginning_of_week, DateTime.now.end_of_week)).call
    render :index
  rescue ArgumentError
    session.delete(:credentials)
    redirect_to oauth2callback_path
  end

  private

  def load_dates_and_rooms
    week_start, week_end = build_week_boundaries
    @days = (week_start..week_end).to_a
    start_time = Time.now.at_beginning_of_day
    end_time = Time.now.at_end_of_day
    @times = time_interval(start_time, end_time, 30.minutes)
    @conference_rooms = ConferenceRoom.all
  end


  def time_interval(start_time, end_time, step)
    (start_time.to_i..end_time.to_i).step(step).collect { |time| Time.at time }
  end

  def week_start
    params[:date].present? ? Date.parse(params[:date]).at_beginning_of_week : Date.today.beginning_of_week
  end

  def build_week_boundaries
    week_end = week_start + CalendarHelper::WEEK_LENGTH - 1
    [week_start, week_end]
  end
end
