class GoogleEventLister
  attr_reader :credentials, :email

  def initialize(credentials, email)
    @credentials = credentials
    @email = email
  end

  def call(starting, ending)
    events = GoogleEvent.list_events(
      @credentials,
      @email,
      starting.to_datetime,
      ending.to_datetime
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
