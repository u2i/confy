module GoogleCalendar
  class GoogleEventWrapper

    EventInvalidRoom = Class.new(StandardError)

    attr_accessor :id, :start_time, :end_time, :summary, :description, :location, :attendees, :conference_room, :creator_email

    def initialize(**params)
      @id = params[:id]
      @start_time = params[:start_time]
      @end_time = params[:end_time]
      @summary = params[:summary]
      @description = params[:description]
      @conference_room = find_conference_room(params[:conference_room_id])
      @creator_email = params[:creator_email]
      @attendees = params[:attendees] || []
    end

    def valid?
      start_time.present? && end_time.present?
    end

    def as_google_event
      Google::Apis::CalendarV3::Event.new.tap do |google_event|
        google_event.id = id
        google_event.start = { date_time: start_time }
        google_event.end = { date_time: end_time }
        google_event.summary = summary
        google_event.description = description
        google_event.location = google_location
        google_event.attendees = google_attendees
      end
    end

    private

    def find_conference_room(conference_room_id)
      return if conference_room_id.nil?
      conference_room = ConferenceRoom.find_by(id: conference_room_id)
      raise EventInvalidRoom, "Undefined conference room: #{conference_room_id}" if conference_room.nil?
      conference_room
    end

    def google_location
      conference_room.nil? ? '' : conference_room.title
    end

    def google_attendees
      attendees + [room_attendee, creator_attendee].compact
    end

    def room_attendee
      return nil unless conference_room
      AttendeeWrapper.new(conference_room.email).as_google_accepted_attendee
    end

    def creator_attendee
      return nil unless creator_email
      AttendeeWrapper.new(creator_email).as_google_accepted_attendee
    end

    class AttendeeWrapper

      ACCEPTED_RESPONSE = 'accepted'.freeze

      def initialize(email)
        @email = email
      end

      def as_google_accepted_attendee
        as_google_attendee.merge response_status: ACCEPTED_RESPONSE
      end

      def as_google_attendee
        { email: email }
      end

      private

      attr_accessor :email
    end
  end
end
