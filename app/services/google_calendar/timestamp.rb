module GoogleCalendar
  class Timestamp
    def self.convert(str)
      Time.at(str.to_i / 1000)
    end
  end
end
