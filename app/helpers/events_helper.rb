module EventsHelper

  def event_style(event)
    return "background: #{event.conference_room.color}"
  end
end
