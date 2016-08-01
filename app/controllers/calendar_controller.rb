require 'google/apis/calendar_v3'
require 'google/api_client/client_secrets'

class CalendarController < ApplicationController
  include GoogleAuthentication
  include GoogleEventListing
  include TimeInterval

  before_action :refresh_token
  before_action :check_authentication
  before_action :create_calendar_props, only: [:index]

  # Index for showing events from Google calendar
  def index
    create_calendar_props
  rescue ArgumentError
    session.delete(:credentials)
    redirect_to oauth2callback_path
  end

  private

  def create_calendar_props
    @props = {conferenceRooms: ConferenceRoom.all,
              initialEvents: events,
              days: calendar_days,
              times: calendar_times,
              unitEventLengthInSeconds: EventGrouper::GRANULARITY,
              date: params[:date]}
  end

  def events
    week_start, week_end = build_week_boundaries(params[:date])
    list_events(week_start, week_end)
  end

  def calendar_days
    week_start, week_end = build_week_boundaries(params[:date])
    (week_start..week_end).to_a
  end

  def calendar_times
    start_time = Time.now.at_beginning_of_day
    end_time = Time.now.at_end_of_day
    time_interval(start_time, end_time, EventGrouper::GRANULARITY)
  end
end
