require 'google/apis/calendar_v3'
require 'google/api_client/client_secrets'

class CalendarController < ApplicationController

  before_action :check_authentication, except: :authenticate
  before_action :refresh_token

  def authenticate
    fail ArgumentError, 'No code parameter' if params[:code].blank?
    session[:credentials] = GoogleOauth.get_user_credentials(params[:code])
    redirect_to action: :index
  rescue
    session.delete(:credentials)
    redirect_to GoogleOauth.request_code_uri
  end

  def refresh_token
    session[:credentials] = GoogleOauth.refresh_token(session[:credentials]) if session[:credentials]
  end

  def index
    week_start, week_end = build_week_boundaries(params[:date])
    index_setup(week_start, week_end)
    @events = Event.in_week_group_by_weekday(week_start)
  end

  def free_rooms
    week_start, week_end = build_week_boundaries(params[:date])
    index_setup(week_start, week_end)
    @events = Event.not_free(week_start)
    render :index
  end

  # Index for showing events from Google calendar
  def google_index
    index_setup(*build_week_boundaries(params[:date]))
    @events = GoogleEvent.list_events(session[:credentials], DateTime.now, DateTime.now + 1.days)
    render :index
  rescue
    session.delete(:credentials)
    redirect_to action: :authenticate
  end

  private
  def index_setup(week_start, week_end)
    @days = (week_start..week_end).to_a
    start_time = Time.now.at_beginning_of_day
    end_time = Time.now.at_end_of_day
    step = 30.minutes
    @times = time_interval(start_time, end_time, step)
    @conference_rooms = ConferenceRoom.all
  end

  def check_authentication
    unless session[:credentials] and GoogleOauth.is_authenticated?(JSON.parse(session[:credentials]))
      redirect_to action: :authenticate
    end
  end

  def time_interval(start_time, end_time, step)
    (start_time.to_i..end_time.to_i).step(step).collect { |time| Time.at time }
  end

  def build_week_boundaries(date)
    week_start = date ? Date.parse(date).at_beginning_of_week : Date.today.beginning_of_week
    week_end = week_start + CalendarHelper::WEEK_LENGTH - 1
    [week_start, week_end]
  end

end
