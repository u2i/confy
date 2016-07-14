module CalendarHelper
  WEEK_LENGTH = 5
  EVENT_TIME_GRANULARITY = 30.minutes

  def event_at(day, time)
    return unless @events[day.wday].present?
    datetime = add_date_and_time(day, time)
    @events[day.wday].find do |event|
      event.start_time == datetime
    end
  end

  def event_ongoing?(day, time)
    return unless @events[day.wday].present?
    datetime = add_date_and_time(day, time)
    @events[day.wday].any? do |event|
      event.start_time < datetime && event.end_time > datetime
    end
  end

  def event_span(event)
    (event.end_time - event.start_time) / EVENT_TIME_GRANULARITY
  end

  def add_date_and_time(date, time)
    date.beginning_of_day + time.seconds_since_midnight.seconds
  end
end
