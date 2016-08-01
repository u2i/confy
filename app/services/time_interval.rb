class TimeInterval
  class << self
    def week(date, length = 5)
      week_start = week_start(date)
      week_end = week_end(week_start, length)
      TimeInterval.new(week_start, week_end)
    end

    def day(date = Time.now)
      TimeInterval.new(date.at_beginning_of_day, date.at_end_of_day)
    end

    private

    def week_start(date)
      date.beginning_of_week.beginning_of_day
    end

    def week_end(week_start, length)
      (week_start + (length - 1).days).end_of_day
    end
  end

  attr_reader :start, :end

  def initialize(starting, ending)
    @start = starting
    @end = ending
  end

  def collect_steps(step)
    (@start.to_i..@end.to_i).step(step).collect { |time| Time.at time }
  end
end
