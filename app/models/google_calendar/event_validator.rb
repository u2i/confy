module GoogleCalendar
  class EventValidator
    EventInvalidParamsError = Class.new(StandardError)
    EventInTimeSpanError = Class.new(StandardError)

    def initialize(wrapper, credentials)
      @wrapper = wrapper
      @credentials = credentials
      @event_finder = GoogleCalendar::EventFinder.new(credentials)
    end

    def raise_if_occupied
      events = events_in_span
      return unless events.any?
      return if events.length == 1 && events.first[:id] == wrapper.id
      raise EventInTimeSpanError, occupied_error_message(events)
    end

    def raise_if_params_invalid
      raise EventInvalidParamsError unless wrapper.valid?
    end

    def raise_if_invalid
      raise_if_params_invalid
      raise_if_occupied
    end

    private

    def event_interval
      TimeInterval.new(wrapper.start.date_time, wrapper.end.date_time).to_rfc3339
    end

    def events_in_span
      event_finder.by_room(event_interval, wrapper.conference_room.id)
    end

    def occupied_error_message(events)
      "Already #{events.count} #{'event'.pluralize(events.count)} in time span (#{event_list(events)})."
    end

    def event_list(events)
      events.map { |event| event[:summary] }.join(', '.freeze)
    end

    attr_accessor :wrapper, :credentials, :event_finder
  end
end
