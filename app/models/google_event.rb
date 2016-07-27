class GoogleEvent
  class InvalidParamsError < StandardError
  end

  EVENT_SCHEMA = Dry::Validation.Schema do
    required(:start).schema do
      required(:date_time).filled
    end

    required(:end).schema do
      required(:date_time).filled
    end
  end.freeze

  class << self
    # You can specify custom fields: https://developers.google.com/google-apps/calendar/v3/reference/events
    FIELDS = 'items(id, start, end, summary, recurrence, creator)'.freeze

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
              event.start.date_time = new_time_low event.start.date_time
              event.end.date_time = new_time_high event.end.date_time
              events[event.start.date_time.wday] ||= []
              events[event.start.date_time.wday] << event.to_h.merge(conference_room: room, timestamp: event.start.date_time.to_i)
            end
          end
        end
      end
      events
    end

    def process_params(params)
      zone = Time.now.getlocal.zone
      params.merge(start: {date_time: DateTime.parse("#{params[:start_time]} #{zone}").rfc3339(9)},
                   end: {date_time: DateTime.parse("#{params[:end_time]} #{zone}").rfc3339(9)}).
        except(:start_time, :end_time, :conference_room_id, :permitted)
    end

    def delete(credentials, event_id)
      calendar_service(credentials).delete_event('primary', event_id)
    end

    def create(credentials, conference_room_id, raw_event_data = {})
      event_data = build_event_data(raw_event_data, conference_room_id)
      insert_event_and_return_result(credentials, event_data)
    end

    def insert_event_and_return_result(credentials, event_data)
      new_event = Google::Apis::CalendarV3::Event.new(event_data)
      calendar_service(credentials).insert_event('primary', new_event)
    end

    def build_event_data(raw_event_data, conference_room_id)
      event_data = raw_event_data.deep_symbolize_keys
      raise_exception_if_invalid(event_data)
      add_room_to_event(event_data, conference_room_id)
      event_data
    end

    def raise_exception_if_invalid(params)
      validation = EVENT_SCHEMA.call params
      exception_message = validation.messages(full: true).values.join(', ')
      raise InvalidParamsError, exception_message unless validation.success?
    end

    def add_room_to_event(params, conference_room_id)
      room = ConferenceRoom.find_by(id: conference_room_id)
      params[:attendees] = [{email: room.email}]
      params[:location] = room.title
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

    GRANULARITY = 30.minutes.freeze
    def new_time_low(time)
      if time > time.beginning_of_hour + GRANULARITY
        time.beginning_of_hour + GRANULARITY
      else
        time.beginning_of_hour
      end
    end

    def new_time_high(time)
      if time > time.beginning_of_hour + GRANULARITY
        time.beginning_of_hour + GRANULARITY + GRANULARITY
      elsif time > time.beginning_of_hour
        time.beginning_of_hour + GRANULARITY
      else
        time.beginning_of_hour
      end
    end
  end

  private_class_method :calendar_service,
                       :client, :raise_exception_if_invalid,
                       :insert_event_and_return_result, :build_event_data
end
