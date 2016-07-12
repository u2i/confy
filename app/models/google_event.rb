class GoogleEvent
  class << self
    #You can specify custom fields: https://developers.google.com/google-apps/calendar/v3/reference/events
    FIELDS = "items(start, end, summary, recurrence, creator(displayName))".freeze

    def list_events(credentials, starting, ending)
      events = {}
      rooms = ConferenceRoom.all
      get_service(credentials).batch do |s|
        rooms.each do |room|
          s.list_events(room.email, fields: FIELDS, single_events: true, time_min: starting.rfc3339(9), time_max: ending.rfc3339(9), time_zone: 'Europe/Warsaw') do |n, _|
            n&.items&.each do |e|
              events[e.start.date_time.wday] ||= []
              ev = Event.new(user: e.creator.display_name, end_time: e.end.date_time, start_time: e.start.date_time, conference_room: room, description: e.summary)
              events[e.start.date_time.wday] << ev
            end
          end
        end
      end
      events
    end

    def get_service(credentials)
      Google::Apis::CalendarV3::CalendarService.new.tap { |s| s.authorization = get_client(credentials) }
    end

    def get_client(credentials)
      Signet::OAuth2::Client.new(JSON.parse(credentials))
    end

    def load_emails()
      ConferenceRoom.pluck(:email)
    end

  end

  private_class_method :get_service, :get_client, :load_emails

end