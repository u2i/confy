class GoogleEventLister
  attr_reader :credentials, :email

  def initialize(credentials, email)
    @credentials = credentials
    @email = email
  end

  def call(time_interval)
    events = GoogleEvent.list_events(
      @credentials,
      @email,
      time_interval.start.to_datetime,
      time_interval.end.to_datetime
    )
    events.flat_map do |_wday, day_events|
      build_groups(day_events)
    end
  end

  private

  def build_groups(events)
    EventGrouper.new(events.sort_by! { |e| e[:end][:date_time] }).call
  end
end
