class TimeRound
  GRANULARITY = 30.minutes.freeze

  class << self
    def floor_time(time)
      return time.beginning_of_hour if time_minutes_below_granularity?(time)
      time.beginning_of_hour + GRANULARITY
    end

    def ceil_time(time)
      if time_minutes_above_granularity?(time)
        time.beginning_of_hour + GRANULARITY + GRANULARITY
      elsif time_above_beginning_of_hour?(time)
        time.beginning_of_hour + GRANULARITY
      else
        time.beginning_of_hour
      end
    end

    private

    def time_minutes_below_granularity?(time)
      time < time.beginning_of_hour + GRANULARITY
    end

    def time_minutes_above_granularity?(time)
      time > time.beginning_of_hour + GRANULARITY
    end

    def time_above_beginning_of_hour?(time)
      time > time.beginning_of_hour
    end
  end
end
