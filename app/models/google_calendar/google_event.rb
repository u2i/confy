module GoogleCalendar
  class GoogleEvent
    def initialize(credentials, user_email)
      @credentials = credentials
      @user_email = user_email
    end

    def create(conference_room_id, raw_event_data = {})
      event_creator.create(conference_room_id, raw_event_data)
    end

    def delete(event_id)
      event_remover.delete(event_id)
    end

    def all(time_interval)
      event_finder.all(time_interval)
    end

    def find_by_room(time_interval, conference_room_ids)
      event_finder.by_room(time_interval, conference_room_ids)
    end

    def confirm(conference_room_id, event_id)
      event = Event.find_by(event_id: event_id)
      event = save_event(conference_room_id, event_id) if event.nil?
      event.confirm
    end

    private

    def save_event(conference_room_id, event_id)
      conference_room = ConferenceRoom.find(conference_room_id)
      Event.create(event_id: event_id, conference_room: conference_room)
    end

    def event_creator
      @event_creator ||= GoogleCalendar::EventCreator.new(credentials, user_email)
    end

    def event_remover
      @event_remover ||= GoogleCalendar::EventRemover.new(credentials)
    end

    def event_finder
      @event_finder ||= GoogleCalendar::EventFinder.new(credentials, user_email)
    end

    attr_accessor :credentials, :user_email
  end
end
