module TimeInterval
  extend ActiveSupport::Concern

  def time_interval(start_time, end_time, step)
    (start_time.to_i..end_time.to_i).step(step).collect { |time| Time.at time }
  end

  def week_start(date)
    date ? Date.parse(date).beginning_of_week : Date.today.beginning_of_week
  end

  def build_week_boundaries(date = nil)
    week_start = week_start(date)
    week_end = (week_start + CalendarHelper::WEEK_LENGTH - 1).end_of_day
    [week_start, week_end]
  end
end
