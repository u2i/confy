module GoogleCalendar
  class EventDataService
    class << self
      def normalize_event_datetime(event)
        whole_day_event?(event) ? normalize_whole_day_event(event) : normalize_partial_day_event(event)
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
        event.start.date_time = Date.parse(event.start.date).beginning_of_day.to_datetime
        event.end.date_time = Date.parse(event.end.date).beginning_of_day.to_datetime
      end

      def normalize_partial_day_event(event)
        event.start.date_time = TimeRound.floor_time(event.start.date_time)
        event.end.date_time = TimeRound.ceil_time(event.end.date_time)
      end
    end
  end
end
