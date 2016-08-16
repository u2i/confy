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

  attr_reader :starting, :ending

  def initialize(starting, ending)
    @starting = starting
    @ending = ending
  end

  def collect_steps(step)
    (@starting.to_i..@ending.to_i).step(step).collect { |time| Time.at time }
  end

  def to_rfc3339
    TimeIntervalRFC3339.new(starting, ending)
  end

  class TimeIntervalRFC3339
    GOOGLE_CALENDAR_TIME_FORMAT = 9
    attr_reader :starting, :ending

    def initialize(starting, ending)
      @starting = starting.to_datetime.rfc3339(GOOGLE_CALENDAR_TIME_FORMAT)
      @ending = ending.to_datetime.rfc3339(GOOGLE_CALENDAR_TIME_FORMAT)
    end
  end
end
