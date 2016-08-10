class GoogleEventLister
  attr_reader :credentials, :email

  def initialize(credentials, email)
    @credentials = credentials
    @email = email
  end

  def call(time_interval)
    events = GoogleEvent.list_events(
      credentials,
      email,
      time_interval.start.to_datetime,
      time_interval.end.to_datetime
    )
    events.values.flatten
  end
end
