class CalendarController < ApplicationController

  def index
    week_start, week_end = build_week_boundaries(params[:date])
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

  def build_week_boundaries(date)
    week_start = date ? Date.parse(date).at_beginning_of_week : Date.today.beginning_of_week
    week_end = week_start + CalendarHelper::WEEK_LENGTH - 1
    [week_start, week_end]
  end

end
