module GoogleCalendar
  class UserEventFinder
    def initialize(client, fields)
      @client = client
      @fields = fields
    end

    def by_id(event_id)
      client.calendar_service.batch do |service|
        calendar_ids.each do |calendar_id|
          try_get_event(service, calendar_id, event_id) do |event|
            return event if event.present?
          end
        end
      end
    end

    private

    attr_accessor :client, :fields

    def calendar_ids
      GoogleCalendar::CalendarFinder.new(client).all_ids
    end

    def get_event(service, calendar_id, event_id)
      service.get_event(calendar_id, event_id, fields: fields) { |result, _| yield result }
    end

    def try_get_event(service, calendar_id, event_id, &block)
      get_event(service, calendar_id, event_id, &block)
      raise if e.status_code != :not_found
    end
  end
end
