module GoogleCalendar
  class EventCreator
    EventInvalidParamsError = Class.new(StandardError)
    EventInTimeSpanError = Class.new(StandardError)
    EventInvalidRoom = Class.new(StandardError)
    ACCEPTED_RESPONSE = 'accepted'.freeze

    EVENT_SCHEMA = Dry::Validation.Schema do
      required(:start).schema do
        required(:date_time).filled
      end

      required(:end).schema do
        required(:date_time).filled
      end
    end.freeze

    def initialize(credentials, user_email)
      @credentials = credentials
      @calendar_service = GoogleCalendar::Client.new(credentials).calendar_service
      @user_email = user_email
    end

    def create(conference_room_id, raw_event_data = {})
      event_data = build_event_data(raw_event_data, conference_room_id)
      insert_event_and_return_result(event_data)
    end

    private

    def insert_event_and_return_result(event_data)
      raise_error_if_occupied(event_data)
      calendar_service.insert_event(
        'primary',
        Google::Apis::CalendarV3::Event.new(event_data)
      )
    end

    def raise_error_if_occupied(event_data)
      events = events_in_span(event_data[:attendees].first,
                              event_data[:start][:date_time], event_data[:end][:date_time])
      return unless events.any?
      error_message = occupied_error_message(events)
      raise(EventInTimeSpanError, error_message)
    end

    def occupied_error_message(events)
      "Already #{events.count} #{'event'.pluralize(events.count)} in time span(#{items_list(events)})."
    end

    def items_list(items)
      items.map(&:summary).join(', '.freeze)
    end

    def build_event_data(raw_event_data, conference_room_id)
      event_data = raw_event_data.to_h.deep_symbolize_keys
      raise_error_if_invalid(event_data)
      add_room_to_event(event_data, conference_room_id)
      add_user_to_event(event_data)
      event_data
    end

    def raise_error_if_invalid(params)
      validation = EVENT_SCHEMA.call(params)
      error_message = validation.messages(full: true).values.join(', ')
      raise EventInvalidParamsError, error_message unless validation.success?
    end

    def add_room_to_event(params, conference_room_id)
      room = ConferenceRoom.find_by(id: conference_room_id)
      raise EventInvalidRoom, "Undefined conference room: #{conference_room_id}" if room.nil?
      params[:attendees].unshift({email: room.email, response_status: ACCEPTED_RESPONSE})
      params[:location] = room.title
    end

    def add_user_to_event(params)
      params[:attendees].push(email: @user_email, response_status: ACCEPTED_RESPONSE)
    end

    def events_in_span(conference_room, starting, ending)
      events = calendar_service.list_events(
        conference_room[:email],
        time_min: starting,
        time_max: ending
      )
      events ? events.items : []
    end

    attr_accessor :credentials, :calendar_service
  end
end
