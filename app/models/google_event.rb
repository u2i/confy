class GoogleEvent
  CALENDAR_IDS = ConferenceRoom.select(:email).map {|k| k[:email]}

  def self.list_events(credentials, starting, ending)
    service = get_service(credentials)
    events = []
    service.batch do |s|
      CALENDAR_IDS.each do |calendar_id|
        s.list_events(calendar_id, fields: "summary, items(start, end, summary, recurrence)", single_events: true, time_min: starting.rfc3339(9), time_max: ending.rfc3339(9), time_zone: 'Europe/Warsaw') do |n, _|
          events << n.to_json
        end
      end
    end

    return events
  end

  def self.get_service(credentials)
    service = Google::Apis::CalendarV3::CalendarService.new
    service.tap { |s| s.authorization = get_client(credentials) }
  end

  def self.get_client(credentials)
    Signet::OAuth2::Client.new(JSON.parse(credentials))
  end

  private_class_method :get_service, :get_client

end