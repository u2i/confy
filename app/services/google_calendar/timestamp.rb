module GoogleCalendar
  module Timestamp
    def str_to_timestamp(str)
      Time.at(str.to_i / 1000)
    end
  end
end
