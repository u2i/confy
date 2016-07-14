module EventsHelper
  def event_style(event)
    "background: #{event.conference_room.color}"
  end

  def next_week(date)
    (date.nil? || !(date.is_a? String)) ? Date.today + 7.days : Date.parse(date) + 7.days
  end

  def previous_week(date)
    (date.nil? || !(date.is_a? String)) ? Date.today - 7.days : Date.parse(date) - 7.days
  end
end
