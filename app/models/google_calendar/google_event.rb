module GoogleCalendar
  class GoogleEvent
    extend Listing
    extend Adding
    extend Deleting

    def self.process_params(params)
      zone = Time.now.getlocal.zone
      params.merge(start: {date_time: DateTime.parse("#{params[:start_time]} #{zone}").rfc3339(9)},
                   end: {date_time: DateTime.parse("#{params[:end_time]} #{zone}").rfc3339(9)}).
        except(:start_time, :end_time, :conference_room_id, :permitted)
    end
  end
end