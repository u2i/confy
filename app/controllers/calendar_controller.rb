require 'google/apis/calendar_v3'
require 'google/api_client/client_secrets'

class CalendarController < ApplicationController
  include GoogleAuthentication
  include GoogleEventClient

  before_action :refresh_token
  before_action :check_authentication

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
              times: calendar_times,
              unitEventLengthInSeconds: TimeRound::GRANULARITY,
              date: params[:date],
              roomKinds: ConferenceRoom::KINDS,
              scrollTo: {hours: 6, minutes: 0}}.compact
  end

  def date_param
    params[:date] ? Date.parse(params[:date]) : Date.today
  end

  def events
    time_interval_rfc3339 = TimeInterval.week(date_param).to_rfc3339
    google_event_client.list_events(time_interval_rfc3339)
  end

  def calendar_days
    TimeInterval.week(date_param).collect_steps(1.day)
  end

  def calendar_times
    TimeInterval.day.collect_steps(TimeRound::GRANULARITY)
  end
end
