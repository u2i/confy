module GoogleCalendar
  module EventWrapper
    class CreatorWrapper

      attr_accessor :display_name, :email, :id, :self

      def initialize(**args)
        @display_name = args[:display_name]
        @email = args[:email]
        @id = args[:id]
        @self = args[:self]
      end

      def as_google_creator
        Google::Apis::CalendarV3::Event::Creator.new(display_name: display_name, email: email, id: id, self: @self)
      end

      def self.from_google_creator(google_creator)
        new(
          display_name: google_creator.display_name,
          email: google_creator.email,
          id: google_creator.id,
          self: google_creator.self
        )
      end

      def to_h
        {
          display_name: display_name,
          email: email,
          id: id,
          self: @self
        }
      end
    end
  end
end
