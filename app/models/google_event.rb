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
    LISTING_FIELDS = 'items(id, start, end, summary, recurrence, creator, attendees(self, responseStatus))'.freeze

    def listing_options(starting, ending)
      {fields: LISTING_FIELDS, single_events: true, time_min: starting.rfc3339(9),
       time_max: ending.rfc3339(9), time_zone: ENV.fetch('TZ'),
       always_include_email: true}.freeze
    end

    def list_events(credentials, user_email, starting, ending)
      all_events = daily_events_container
      rooms = ConferenceRoom.all
      calendar_service(credentials).batch do |service|
        rooms.each do |room|
          add_events_from_room(room, service, all_events, listing_options(starting, ending))
        end
      end
      mark_user_events(user_email, all_events)
      all_events
    end

    def daily_events_container
      Hash[(1..CalendarHelper::WEEK_LENGTH).map { |i| [i, []] }]
    end

    def mark_user_events(user_email, all_events)
      all_events.values.each do |events|
        events.each do |event|
          creator_email = event[:creator][:email]
          event[:creator][:self] = (user_email == creator_email)
        end
      end
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

    def add_events_from_room(room, service, events, config)
      service.list_events(room.email, config) do |result, _|
        if result
          result.items.each do |event|
            next if event_declined?(event)
            normalize_event_datetime(event)
            events[event.start.date_time.wday].push(
              event.to_h.merge(conference_room: room, timestamp: event.start.date_time.to_i)
            )
          end
        end
      end
    end

    GOOGLE_EVENT_DECLINED_RESPONSE = 'declined'.freeze
    # self is a field from Google::Apis::CalendarV3::EventAttendee
    def event_declined?(event)
      event.attendees.find(&:self).response_status == GOOGLE_EVENT_DECLINED_RESPONSE
    end

    def normalize_event_datetime(event)
      event.start.date_time = EventGrouper.floor_time(event.start.date_time)
      event.end.date_time = EventGrouper.ceil_time(event.end.date_time)
    end
  end

  private_class_method :calendar_service,
                       :client, :raise_exception_if_invalid,
                       :insert_event_and_return_result, :build_event_data,
                       :daily_events_container, :items_list
end
