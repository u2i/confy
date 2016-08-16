module GoogleCalendar
  class EventDataService
    class << self
      def with_normalized_datetime(event)
        if whole_day_event?(event)
          normalize_whole_day_event(event)
          event.to_h.merge(additional_properties(event.start.date_time, event.end.date_time))
        else
          event.to_h.merge(additional_properties(*rounded_time_span(event)))
        end

      end

      def whole_day_event?(event)
        event.start.date.present?
      end

      def process_params(params)
        zone = Time.now.getlocal.zone
        params.merge(start: {date_time: datetime_parse(params[:start_time], zone)},
                     end: {date_time: datetime_parse(params[:end_time], zone)}).
          except(:start_time, :end_time, :conference_room_id, :permitted)
      end

      private

      def datetime_parse(time, zone)
        DateTime.parse("#{time} #{zone}").rfc3339(9)
      end

      def normalize_whole_day_event(event)
        event.start.date_time = at_beginning_of_day(event.start.date)
        event.end.date_time = at_beginning_of_day(event.end.date)
      end

      def at_beginning_of_day(date)
        Date.parse(date).beginning_of_day.to_datetime
      end

      def rounded_time_span(event)
        [TimeRound.floor_time(event.start.date_time), TimeRound.ceil_time(event.end.date_time)]
      end

      def additional_properties(rounded_start_time, rounded_end_time)
        {
          start_timestamp: rounded_start_time.to_i,
          end_timestamp: rounded_end_time.to_i,
          rounded_start_time: rounded_start_time,
          rounded_end_time: rounded_end_time
        }
      end
    end
  end
end
