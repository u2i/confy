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
        @attendees = build_attendees(params[:attendees])
        @conference_room = get_conference_room(params[:conference_room_id])
        @creator = build_creator(params)

        initialize_times(params)
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

      def build_attendees(attendees)
        attendees.nil? ? [] : attendees.map { |attendee| new_attendee(attendee.to_h) }
      end

      def new_attendee(attendee_data)
        Google::Apis::CalendarV3::EventAttendee.new(attendee_data)
      end

      def get_conference_room(conference_room_id)
        return if conference_room_id.nil?
        ConferenceRoom.find_or_raise(conference_room_id)
      end

      def build_creator(params)
        params.key?(:creator) ? params[:creator] : new_creator(params[:creator_email])
      end

      def new_creator(creator_email)
        Google::Apis::CalendarV3::Event::Creator.new(email: creator_email)
      end

      def initialize_times(**params)
        return unless params.key?(:start) || params.key?(:end)
        @start_time = build_time(params[:start])
        @end_time = build_time(params[:end])
      end

      def build_time(time_data)
        time_data.is_a?(Google::Apis::CalendarV3::EventDateTime) ? time_data : new_datetime(time_data)
      end

      def new_datetime(time_data)
        Google::Apis::CalendarV3::EventDateTime.new(date: time_data[:date], date_time: time_data[:date_time])
      end

      def google_location
        conference_room.nil? ? '' : conference_room.title
      end

      def google_attendees
        attendees + [room_attendee, creator_attendee].compact
      end

      def room_attendee
        return nil unless conference_room
        Google::Apis::CalendarV3::EventAttendee.new(email: conference_room.email, response_status: 'accepted')
      end

      def creator_attendee
        return nil unless current_user_email
        Google::Apis::CalendarV3::EventAttendee.new(email: current_user_email, response_status: 'accepted')
      end
    end
  end
end
