module EventsHelper
  def event_style(event)
    "background: #{event.conference_room.color}"
  end

  def next_week(date)
    date.blank? ? Date.today.next_week : Date.parse(date.to_s).next_week
  end

  def previous_week(date)
    date.blank? ? Date.today.prev_week : Date.parse(date.to_s).prev_week
  end
end
