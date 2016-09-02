module GoogleCalendar
  module EventWrapper
    class Builder

      def initialize(google_event, conference_room)
        @google_event = google_event
        @conference_room = conference_room
      end

      def build_event_wrapper
        GoogleCalendar::EventWrapper::Event.new(default_params)
      end

      def build_rounded_event_wrapper
        GoogleCalendar::EventWrapper::RoundedEvent.new(default_params)
      end

      private

      attr_accessor :google_event, :conference_room

      def default_params
        {
          id: google_event.id,
          start: google_event.start.to_h,
          end: google_event.end.to_h,
          summary: google_event.summary,
          description: google_event.description,
          creator: parse_creator,
          conference_room_id: conference_room.id,
          attendees: parse_attendees,
          all_day: google_event.start.date.present?
        }
      end

      def parse_creator
        google_event.creator.nil? ? nil : CreatorWrapper.from_google_creator(google_event.creator)
      end

      def parse_attendees
        return if google_event.attendees.nil?
        google_event.attendees.reject { |attendee| attendee_is_creator(attendee) || attendee_is_conference_room(attendee) }
      end

      def attendee_is_creator(attendee)
        attendee.email == google_event.creator.email
      end

      def attendee_is_conference_room(attendee)
        attendee.email == conference_room.email
      end
    end
  end
end
