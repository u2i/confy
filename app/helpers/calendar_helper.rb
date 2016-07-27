module CalendarHelper
  WEEK_LENGTH = 5

  def add_date_and_time(date, time)
    date.beginning_of_day + time.seconds_since_midnight.seconds
  end
end
