module GoogleCalendar
  module Adding
    include Client

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
  end
end
