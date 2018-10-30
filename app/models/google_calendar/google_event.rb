module GoogleCalendar
  class GoogleEvent
    def initialize(calendar_service:, user_email:)
      @user_email = user_email
      @calendar_service = calendar_service
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

    def finish(conference_room, event_id)
      event_editor.finish(conference_room, event_id)
    end

    def update(conference_room, event_id, data)
      event_editor.update(conference_room, event_id, data)
    end

    private

    attr_accessor :calendar_service, :user_email

    def event_creator
      @event_creator ||= GoogleCalendar::EventCreator.new(calendar_service, user_email)
    end

    def event_remover
      @event_remover ||= GoogleCalendar::EventRemover.new(calendar_service)
    end

    def event_finder
      @event_finder ||= GoogleCalendar::EventFinder.new(calendar_service, user_email)
    end

    def event_editor
      @event_editor ||= GoogleCalendar::EventEditor.new(calendar_service, user_email)
    end
  end
end
