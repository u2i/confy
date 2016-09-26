module GoogleCalendar
  class GoogleEvent
    def initialize(credentials, user_email)
      @credentials = credentials
      @user_email = user_email
    end

    def create(event_data = {})
      event_creator.create(event_data)
    end

    def delete(event_id)
      event_remover.delete(event_id)
    end

    def all(time_interval)
      event_finder.all(time_interval)
    end

    def find_by_room(time_interval, conference_room_ids, with_confirmation = false)
      event_finder.by_room(time_interval, conference_room_ids, with_confirmation)
    end

    def confirmed_events(time_interval)
      event_finder.confirmed_events(time_interval)
    end

    def finish(conference_room_id, event_id)
      event_editor.finish(conference_room_id, event_id)
    end

    def update(conference_room_id, event_id, data)
      event_editor.update(conference_room_id, event_id, data)
    end

    private

    attr_accessor :credentials, :user_email

    def event_creator
      @event_creator ||= GoogleCalendar::EventCreator.new(credentials, user_email)
    end

    def event_remover
      @event_remover ||= GoogleCalendar::EventRemover.new(credentials)
    end

    def event_finder
      @event_finder ||= GoogleCalendar::EventFinder.new(credentials, user_email)
    end

    def event_editor
      @event_editor ||= GoogleCalendar::EventEditor.new(credentials, user_email)
    end
  end
end
