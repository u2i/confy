class GoogleEvent
  InvalidParamsError = Class.new(StandardError)
  EventInTimeSpanError = Class.new(StandardError)

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
    FIELDS = 'items(id, start, end, summary, recurrence, creator, attendees(self, responseStatus))'.freeze

    def list_events(credentials, starting, ending)
      events = {}
      rooms = ConferenceRoom.all
      config = {fields: FIELDS, single_events: true, time_min: starting.rfc3339(9),
                time_max: ending.rfc3339(9), time_zone: 'Europe/Warsaw',
                always_include_email: true}.freeze
      calendar_service(credentials).batch do |service|
        rooms.each do |room|
          add_events_from_room(room, service, events, config)
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
      events = events_in_span(credentials, event_data[:attendees].first,
                              event_data[:start][:date_time], event_data[:end][:date_time])
      if events && events.items.any?
        count = events.items.size
        raise(
          EventInTimeSpanError,
          "Already #{count} #{'event'.pluralize(count)} in time span(#{items_list(events.items)})."
        )
      end
      calendar_service(credentials).insert_event(
        'primary',
        Google::Apis::CalendarV3::Event.new(event_data)
      )
    end

    def items_list(items)
      items.map(&:summary).join(', '.freeze)
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

    def events_in_span(credentials, conference_room, starting, ending)
      calendar_service(credentials).list_events(
        conference_room[:email],
        time_min: starting,
        time_max: ending
      )
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

    GOOGLE_EVENT_DECLINED_RESPONSE = 'declined'.freeze
    def add_events_from_room(room, service, events, config)
      service.list_events(room.email, config) do |result, _|
        if result
          result.items.each do |event|
            next if event_declined?(event)
            normalize_dates(event)
            events[event.start.date_time.wday] ||= []
            events[event.start.date_time.wday] << event.to_h.merge(conference_room: room)
          end
        end
      end
    end

    # self is a field from Google::Apis::CalendarV3::EventAttendee
    def event_declined?(event)
      event.attendees.find(&:self).response_status == GOOGLE_EVENT_DECLINED_RESPONSE
    end

    def normalize_dates(event)
      event.start.date_time = floor_time(event.start.date_time)
      event.end.date_time = ceil_time(event.end.date_time)
    end

    GRANULARITY = 30.minutes.freeze
    def floor_time(time)
      if time > time.beginning_of_hour + GRANULARITY
        time.beginning_of_hour + GRANULARITY
      else
        time.beginning_of_hour
      end
    end

    def ceil_time(time)
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
                       :insert_event_and_return_result, :build_event_data,
                       :items_list, :ceil_time, :floor_time
end
