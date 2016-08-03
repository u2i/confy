module GoogleCalendar
  class GoogleEvent
    extend Listing
    extend Adding
    extend Deleting

    def self.process_params(params)
      zone = Time.now.getlocal.zone
      params.merge(start: {date_time: datetime_parse(params[:start_time], zone)},
                   end: {date_time: datetime_parse(params[:end_time], zone)}).
        except(:start_time, :end_time, :conference_room_id, :permitted)
    end

    def self.datetime_parse(time, zone)
      "#{time} #{zone}".rfc3339(9)
    end
  end
end
