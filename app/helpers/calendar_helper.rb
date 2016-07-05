module CalendarHelper

  def get_event(day, time)
    datetime = add_date_and_time(day, time)
    @events[day.wday].find do |event|
      event.start_time == datetime
    end if @events[day.wday]
  end

  def event_ongoing?(day, time)
    datetime = add_date_and_time(day, time)
    @events[day.wday].any? do |event|
      event.start_time < datetime && event.end_time > datetime
    end if @events[day.wday]
  end

  def event_span(event)
    event ? (event.end_time - event.start_time) / 30.minutes : 1
  end

  def add_date_and_time(date, time)
    date.to_datetime + time.seconds_since_midnight.seconds
  end
end
