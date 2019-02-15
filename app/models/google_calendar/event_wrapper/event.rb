module GoogleCalendar
  module EventWrapper
    class Event < DelegateClass(::Google::Apis::CalendarV3::Event)
      attr_accessor :conference_room, :user_email, :google_event

      FIELDS = %i(id start end description creator attendees extended_properties summary hangout_link html_link).freeze

      def initialize(google_event, params = {})
        super(google_event)
        @google_event = google_event
        @user_email = params[:user_email]
        @conference_room = params[:conference_room]
      end

      def update(params)
        self.start_time = params[:start_time] if params.key? :start_time
        self.end_time = params[:end_time] if params.key? :end_time
        self.summary = params[:summary] if params.key? :summary
        self.description = params[:description] if params.key? :description
        self.extended_properties = params[:extended_properties] if params.key? :extended_properties
      end

      def to_h
        super.slice(*FIELDS).merge(conference_room: conference_room)
      end

      def mark_user_event
        return if creator.nil?
        creator.self = (user_email == creator.email)
      end

      def valid?
        return false unless starting.present? && ending.present?
        start_time.present? && end_time.present?
      end

      def all_day?
        start.date.present?
      end

      def in_progress?
        current_time >= start_time && current_time <= end_time
      end

      def end_time
        ending.date_time
      end

      def start_time
        starting.date_time
      end

      def end_time=(ending)
        self.end.date_time = ending
      end

      def start_time=(starting)
        self.start.date_time = starting
      end

      private

      def current_time
        DateTime.now
      end

      def starting
        send(:start)
      end

      def ending
        send(:end)
      end
    end
  end
end
