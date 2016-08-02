module GoogleCalendar
  module Deleting
    include Client

    def delete(credentials, event_id)
      calendar_service(credentials).delete_event('primary', event_id)
    end
  end
end