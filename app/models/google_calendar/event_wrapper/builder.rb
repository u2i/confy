module GoogleCalendar
  module EventWrapper
    class Builder
      def build_empty_creator
        Google::Apis::CalendarV3::Event::Creator.new
      end
    end
  end
end
