class GoogleEvent
  class << self
    # You can specify custom fields: https://developers.google.com/google-apps/calendar/v3/reference/events
    FIELDS = 'items(id, start, end, summary, recurrence, creator(displayName))'.freeze

    def list_events(credentials, starting, ending)
      events = []
      rooms = ConferenceRoom.first(2)
      calendar_service(credentials).batch do |service|
        rooms.each do |room|
          config = {fields: FIELDS, single_events: true, time_min: starting.rfc3339(9),
                     time_max: ending.rfc3339(9), time_zone: 'Europe/Warsaw'}
          service.list_events(room.email, config) do |result, _|
            next unless result
            result.items&.each do |event|
              event.start.date_time = new_time_low event.start.date_time
              event.end.date_time = new_time_high event.end.date_time
              events << event.to_h.merge({ conference_room: room })
            end
          end
        end
      end
      events.sort_by! { |a| a[:end][:date_time] }
    end

    def calendar_service(credentials)
      Google::Apis::CalendarV3::CalendarService.new.tap { |s| s.authorization = client(credentials) }
    end

    def client(credentials)
      Signet::OAuth2::Client.new(JSON.parse(credentials))
    end

    def load_emails
      ConferenceRoom.pluck(:email)
    end

    def new_time_low(time)
      if time > time.beginning_of_hour + 30.minutes
        time.beginning_of_hour + 30.minutes
      else
        time.beginning_of_hour
      end
    end

    def new_time_high(time)
      if time > time.beginning_of_hour + 30.minutes
        time.beginning_of_hour + 1.hour
      elsif time > time.beginning_of_hour
        time.beginning_of_hour + 30.minutes
      else
        time.beginning_of_hour
      end
    end

  end

  private_class_method :calendar_service, :client, :load_emails

end