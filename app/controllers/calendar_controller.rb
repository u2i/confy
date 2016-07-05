class CalendarController < ApplicationController
  helper_method :get_event, :event_ongoing?, :event_span

  def index
    week_start = Date.new(2016, 6, 11)
    week_end = Date.new(2016, 6, 15)
    @days = (week_start..week_end).to_a

    start_time = Time.now.at_beginning_of_day
    end_time = Time.now.at_end_of_day
    step = 30.minutes
    @times = time_interval(start_time, end_time, step)

    @events = {}
    @days.each do |day|
      @events[day.wday] = []
    end
    Event.all.map do |event|
      wday = event.start_time.wday
      @events[wday] << event
    end

  end

  def get_event(day, time)
    datetime = add_date_and_time(day, time)
    @events[day.wday].find do |event|
      event.start_time == datetime
    end
  end

  def event_ongoing?(day, time)
    datetime = add_date_and_time(day, time)
    @events[day.wday].any? do |event|
      event.start_time < datetime && event.end_time > datetime
    end
  end

  def event_span(event)
    event ? (event.end_time - event.start_time) / 30.minutes : 1
  end

  private
  def time_interval(start_time, end_time, step)
    (start_time.to_i..end_time.to_i).step(step).collect { |time| Time.at time }
  end

  def add_date_and_time(date, time)
    date.to_datetime + time.seconds_since_midnight.seconds
  end
end
