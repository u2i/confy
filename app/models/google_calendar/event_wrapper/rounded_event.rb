module GoogleCalendar
  module EventWrapper
    class RoundedEvent < GoogleCalendar::EventWrapper::Event

      attr_accessor :rounded_start_time, :rounded_end_time, :start_timestamp, :end_timestamp

      def initialize(**args)
        super
        normalize_datetime
        rounded_start, rounded_end = rounded_time_span
        @rounded_start_time = rounded_start
        @rounded_end_time = rounded_end
        @start_timestamp = rounded_start.to_i
        @end_timestamp = rounded_end.to_i
      end

      def to_h
        super.merge(
          {
            rounded_start_time: rounded_start_time,
            rounded_end_time: rounded_end_time,
            start_timestamp: start_timestamp,
            end_timestamp: end_timestamp
          }
        )
      end

      private

      def rounded_time_span
        [TimeRound.floor_time(start_time.date_time), TimeRound.ceil_time(end_time.date_time)]
      end

      def normalize_datetime
        normalize_whole_day_event if self.all_day
      end

      def normalize_whole_day_event
        start_time.date_time = at_beginning_of_day(start_time.date)
        end_time.date_time = at_beginning_of_day(end_time.date)
      end

      def at_beginning_of_day(date)
        date.beginning_of_day.to_datetime
      end
    end
  end
end
