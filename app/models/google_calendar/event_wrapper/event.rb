module GoogleCalendar
  module EventWrapper
    class Event < DelegateClass(::Google::Apis::CalendarV3::Event)

      attr_accessor :conference_room, :user_email, :google_event

      def initialize(google_event, params={})
        super(google_event)
        @google_event = google_event
        @user_email = params[:user_email]
        @conference_room = params[:conference_room]
      end

      def as_google_event
        google_event
      end

      def to_h
        {
          id: id,
          start: start.to_h,
          end: end_time.to_h,
          description: description,
          conference_room: conference_room,
          creator: creator.try(:to_h),
          attendees: attendees.map(&:to_h),
          summary: summary
        }
      end

      def mark_user_event
        return if creator.nil?
        creator.self = (user_email == creator.email)
      end

      def valid?
        return false unless start.present? || end_time.present?
        start.date_time.present? && end_time.date_time.present?
      end

      def end_time
        send(:end)
      end

      def all_day?
        start.date.present?
      end
    end
  end
end
