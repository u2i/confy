module GoogleCalendar
  module EventWrapper
    class RoundedEvent < GoogleCalendar::EventWrapper::Event
      attr_accessor :start_timestamp, :end_timestamp

      def initialize(google_event, params={})
        super
        normalize_datetime
        @start_timestamp = rounded_start_time.to_i
        @end_timestamp = rounded_end_time.to_i
      end

      def to_h
        super.merge(
          rounded_start_time: rounded_start_time,
          rounded_end_time: rounded_end_time,
          start_timestamp: start_timestamp,
          end_timestamp: end_timestamp
        )
      end

      def rounded_start_time
        @rounded_start_time ||= TimeRound.floor_time(start.date_time)
      end

      def rounded_end_time
        @rounded_end_time ||= TimeRound.ceil_time(end_time.date_time)
      end

      def at_beginning_of_day(date)
        date.beginning_of_day.to_datetime
      end

      private

      def normalize_datetime
        normalize_whole_day_event if all_day?
      end

      def normalize_whole_day_event
        start.date_time = at_beginning_of_day(start.date)
        end_time.date_time = at_beginning_of_day(end_time.date)
      end
    end
  end
end
