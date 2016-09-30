module GoogleCalendar
  class CalendarFinder
    def initialize(client)
      @client = client
    end

    def all_ids
      own_calendar_list('items(id)').items.map(&:id)
    end

    private

    attr_accessor :client

    def own_calendar_list(fields)
      client.calendar_service.list_calendar_lists(fields: fields, min_access_role: 'writer')
    end
  end
end
