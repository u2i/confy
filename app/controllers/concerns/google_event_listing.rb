module GoogleEventListing
  extend ActiveSupport::Concern

  def list_events(starting, ending)
    events = GoogleEvent.list_events(
        session[:credentials],
        session[:email],
        starting.to_datetime,
        ending.to_datetime)
    grouped_events = events.map do |_wday, events|
      build_groups(events)
    end
    grouped_events.flatten!(1)
  end

  def build_groups(events)
    EventGrouper.new(events.sort_by! { |e| e[:end][:date_time] }).call
  end
end
