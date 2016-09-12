module GoogleCalendar
  module EventWrapper
    class GoogleEventBuilder < GoogleCalendar::EventWrapper::Builder
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
          summary: google_event.summary,
          description: google_event.description,
          start: google_event.start,
          end: google_event.end,
          creator: creator,
          conference_room: conference_room,
          attendees: parse_attendees,
          all_day: lasts_all_day?
        }
      end

      def creator
        google_event.creator || build_empty_creator
      end

      def parse_attendees
        return unless google_event.attendees
        google_event.attendees.reject do |attendee|
          attendee_is_creator(attendee) || attendee_is_conference_room(attendee)
        end
      end

      def attendee_is_creator(attendee)
        attendee.email == google_event.creator.email
      end

      def attendee_is_conference_room(attendee)
        attendee.email == conference_room.email
      end

      def lasts_all_day?
        google_event.start.date.present?
      end
    end
  end
end