module GoogleCalendar
  module EventWrapper
    class Event < DelegateClass(::Google::Apis::CalendarV3::Event)
      attr_accessor :conference_room, :user_email, :google_event
      FIELDS = %i(id start end description creator attendees summary hangout_link).freeze

      def initialize(google_event, params = {})
        super(google_event)
        @google_event = google_event
        @user_email = params[:user_email]
        @conference_room = params[:conference_room]
      end

      def to_h
        super.slice(*FIELDS).merge(conference_room: conference_room)
      end

      def mark_user_event
        return if creator.nil?
        creator.self = (user_email == creator.email)
      end

      def valid?
        return false unless start_time.present? || end_time.present?
        start_time.date_time.present? && end_time.date_time.present?
      end

      def end_time
        send(:end)
      end

      def start_time
        send(:start)
      end

      def all_day?
        start.date.present?
      end
    end
  end
end
