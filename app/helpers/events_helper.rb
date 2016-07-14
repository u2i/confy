module EventsHelper

  def event_style(event)
    "background: #{event.conference_room.color}"
  end
end
