module GoogleCalendar
  class EventDataService
    class << self
      def process_params(params)
        zone = Time.now.getlocal.zone
        processed_params = params.merge(
          start: {date_time: datetime_parse(params[:start_time], zone)},
          end: {date_time: datetime_parse(params[:end_time], zone)}
        ).except(:start_time, :end_time, :permitted)
        processed_params.to_h.deep_symbolize_keys
      end

      private

      def datetime_parse(time, zone)
        DateTime.parse("#{time} #{zone}")
      end
    end
  end
end
