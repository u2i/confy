module GoogleCalendar
  module EventWrapper
    class Event
      attr_accessor :id, :start_time, :end_time, :summary, :description,
                    :location, :attendees, :conference_room, :creator, :current_user_email

      def initialize(**params)
        @id = params[:id]
        @summary = params[:summary]
        @description = params[:description]
        @current_user_email = params[:user_email]
        @attendees = params[:attendees]
        @conference_room = params[:conference_room]
        @start_time = params[:start]
        @end_time = params[:end]
        @creator = params[:creator]
      end

      def as_google_event
        Google::Apis::CalendarV3::Event.new.tap do |google_event|
          google_event.start = start_time
          google_event.end = end_time
          google_event.summary = summary
          google_event.description = description
          google_event.location = google_location
          google_event.attendees = google_attendees
        end
      end

      def to_h
        {
          id: id,
          start: start_time.to_h,
          end: end_time.to_h,
          description: description,
          conference_room: conference_room,
          creator: creator.to_h,
          attendees: attendees.map(&:to_h),
          summary: summary
        }
      end

      def mark_user_event(current_user_email)
        return if creator.nil?
        creator.self = (current_user_email == creator.email)
      end

      def valid?
        return false unless start_time.present? || end_time.present?
        start_time.date_time.present? && end_time.date_time.present?
      end

      private

      def google_location
        conference_room.try(:title) || ''
      end

      def google_attendees
        attendees + [room_attendee, creator_attendee].compact
      end

      def room_attendee
        return unless conference_room
        Google::Apis::CalendarV3::EventAttendee.new(email: conference_room.email, response_status: 'accepted')
      end

      def creator_attendee
        return unless current_user_email
        Google::Apis::CalendarV3::EventAttendee.new(email: current_user_email, response_status: 'accepted')
      end
    end
  end
end
