class CalendarController < ApplicationController

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

  private
  def time_interval(start_time, end_time, step)
    (start_time.to_i..end_time.to_i).step(step).collect { |time| Time.at time }
  end

end
