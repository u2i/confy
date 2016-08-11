module GoogleCalendar
  class GoogleEvent
    def initialize(credentials, user_email)
      @credentials = credentials
      @user_email = user_email
    end

    def create(conference_room_id, raw_event_data = {})
      event_creator = GoogleCalendar::EventCreator.new(credentials)
      event_creator.create(conference_room_id, raw_event_data)
    end

    def delete(event_id)
      event_remover = GoogleCalendar::EventRemover.new(credentials)
      event_remover.delete(event_id)
    end

    def list_events(time_interval)
      event_finder = GoogleCalendar::EventFinder.new(credentials, user_email)
      event_finder.list_events(time_interval)
    end

    private

    attr_accessor :credentials, :user_email
  end
end
