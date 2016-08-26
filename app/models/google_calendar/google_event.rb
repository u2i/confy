module GoogleCalendar
  class GoogleEvent
    def initialize(credentials, user_email)
      @credentials = credentials
      @user_email = user_email
    end

    def create(conference_room_id, raw_event_data = {})
      GoogleCalendar::EventCreator.new(credentials, user_email).create(conference_room_id, raw_event_data)
    end

    def delete(event_id)
      GoogleCalendar::EventRemover.new(credentials).delete(event_id)
    end

    def all(time_interval)
      GoogleCalendar::EventFinder.new(credentials, user_email).all(time_interval)
    end

    def find_by_room(time_interval, conference_room_ids)
      GoogleCalendar::EventFinder.new(credentials, user_email).by_room(time_interval, conference_room_ids)
    end

    private

    attr_accessor :credentials, :user_email
  end
end
