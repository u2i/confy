module GoogleCalendar
  class GoogleEvent

    def self.process_params(params)
      zone = Time.now.getlocal.zone
      params.merge(start: {date_time: datetime_parse(params[:start_time], zone)},
                   end: {date_time: datetime_parse(params[:end_time], zone)}).
        except(:start_time, :end_time, :conference_room_id, :permitted)
    end

    def self.datetime_parse(time, zone)
      "#{time} #{zone}".rfc3339(9)
    end

    def initialize(credentials, user_email)
      @credentials = credentials
      @user_email = user_email
    end

    def create(conference_room_id, raw_event_data = {})
      event_creator = GoogleCalendar::EventCreator.new(credentials)
      event_creator.create(conference_room_id, raw_event_data)
    end

    def delete(event_id)
      event_remover = GoogleCalendar::EventRemover.new(credentials)
      event_remover.delete(event_id)
    end

    def list_events(starting, ending)
      event_finder = GoogleCalendar::EventFinder.new(credentials, user_email)
      event_finder.list_events(starting, ending)
    end

    private

    attr_accessor :credentials, :user_email
  end
end
