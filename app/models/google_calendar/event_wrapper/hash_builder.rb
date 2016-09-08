module GoogleCalendar
  module EventWrapper
    class HashBuilder < GoogleCalendar::EventWrapper::Builder
      def initialize(params)
        data = params.deep_symbolize_keys
        @summary = data[:summary]
        @description = data[:description]
        @user_email = data[:user_email]
        @start_time = build_date_time(data[:start_time])
        @end_time = build_date_time(data[:end_time])
        @attendees = build_attendees(data[:attendees])
        @conference_room = build_conference_room(data[:conference_room_id])
        @creator = build_empty_creator
      end

      def build_event_wrapper
        GoogleCalendar::EventWrapper::Event.new(default_params)
      end

      def build_rounded_event_wrapper
        GoogleCalendar::EventWrapper::RoundedEvent.new(default_params)
      end

      private

      attr_accessor :summary, :description, :location, :start_time,
                    :end_time, :attendees, :conference_room, :user_email, :creator

      def build_date_time(date_time)
        Google::Apis::CalendarV3::EventDateTime.new(date_time: format_date_time(date_time)) if date_time
      end

      def format_date_time(time)
        DateTime.parse("#{time} #{time_zone}")
      end

      def time_zone
        @time_zone ||= Time.now.getlocal.zone
      end

      def build_attendees(attendees)
        attendees.nil? ? [] : attendees.map { |attendee| new_attendee(attendee) }
      end

      def new_attendee(attendee_data)
        Google::Apis::CalendarV3::EventAttendee.new(attendee_data)
      end

      def build_conference_room(conference_room_id)
        return if conference_room_id.nil?
        ConferenceRoom.find_or_raise(conference_room_id)
      end

      def default_params
        {
          summary: summary,
          description: description,
          start: start_time,
          end: end_time,
          conference_room: conference_room,
          attendees: attendees,
          user_email: user_email,
          creator: creator
        }
      end
    end
  end
end
