class GoogleEventLister
  attr_reader :credentials, :email

  def initialize(credentials, email)
    @credentials = credentials
    @email = email
  end

  def call(time_interval)
    google_event = GoogleCalendar::GoogleEvent.new(credentials, email)
    events = google_event.list_events(time_interval.start.to_datetime, time_interval.end.to_datetime)
    events.values.flatten
  end

  private

  def build_groups(events)
    EventGrouper.new(events).build_blocks
  end
end
