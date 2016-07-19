class GoogleEvent
  class << self
    # You can specify custom fields: https://developers.google.com/google-apps/calendar/v3/reference/events
    FIELDS = 'items(start, end, summary, recurrence, creator(displayName))'.freeze

    def list_events(credentials, starting, ending)
      events = {}
      rooms = ConferenceRoom.all
      calendar_service(credentials).batch do |service|
        rooms.each do |room|
          config = {fields: FIELDS, single_events: true, time_min: starting.rfc3339(9),
                     time_max: ending.rfc3339(9), time_zone: 'Europe/Warsaw'}
          service.list_events(room.email, config) do |result, _|
            next unless result
            result.items&.each do |event|
              events[event.start.date_time.wday] ||= []
              events[event.start.date_time.wday] << Event.new(
                  user: event.creator.display_name,
                  end_time: event.end.date_time,
                  start_time: event.start.date_time,
                  conference_room: room,
                  description: event.description,
                  name: event.summary
              )
            end
          end
        end
      end
      events
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

  end

  private_class_method :calendar_service, :client, :load_emails

end