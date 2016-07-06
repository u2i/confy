class CalendarController < ApplicationController

  def index
    week_start = params[:date] ? Date.parse(params[:date]).at_beginning_of_week : Date.today.beginning_of_week
    week_end = week_start + CalendarHelper::WEEK_LENGTH - 1
    @days = (week_start..week_end).to_a

    start_time = Time.now.at_beginning_of_day
    end_time = Time.now.at_end_of_day
    step = 30.minutes
    @times = time_interval(start_time, end_time, step)

    @events = Event.in_week_group_by_weekday(week_start)
  end

  private
  def time_interval(start_time, end_time, step)
    (start_time.to_i..end_time.to_i).step(step).collect { |time| Time.at time }
  end

end
