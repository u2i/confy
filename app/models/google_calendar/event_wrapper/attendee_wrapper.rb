module GoogleCalendar
  module EventWrapper
    class AttendeeWrapper

      ACCEPTED_RESPONSE = 'accepted'.freeze

      def initialize(email)
        @email = email
      end

      def as_google_accepted_attendee
        as_google_attendee.tap { |attendee| attendee.response_status = ACCEPTED_RESPONSE }
      end

      def as_google_attendee
        Google::Apis::CalendarV3::EventAttendee.new(email: email)
      end

      private

      attr_accessor :email
    end
  end
end
