require 'google/apis/calendar_v3'
require 'google/api_client/client_secrets'

class CalendarController < ApplicationController
  before_action :check_authentication, except: :authenticate
  before_action :refresh_token
  before_action only: [:index, :free_rooms, :google_index] do
    index_setup(*build_week_boundaries)
  end

  def authenticate
    raise ArgumentError, 'No code parameter' if params[:code].blank?
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
    @events = Event.in_week_group_by_weekday(week_start)
  end

  # Index for showing events from Google calendar
  def google_index
    @events = GoogleEvent.list_events(session[:credentials], DateTime.now, DateTime.now + 1.days)
    render :index
  rescue ArgumentError
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
    unless session[:credentials] && GoogleOauth.is_authenticated?(JSON.parse(session[:credentials]))
      redirect_to action: :authenticate
    end
  end

  def time_interval(start_time, end_time, step)
    (start_time.to_i..end_time.to_i).step(step).collect { |time| Time.at time }
  end

  def week_start
    params[:date] ? Date.parse(params[:date]).at_beginning_of_week : Date.today.beginning_of_week
  end

  def build_week_boundaries
    week_end = week_start + CalendarHelper::WEEK_LENGTH - 1
    [week_start, week_end]
  end
end
