module ConfirmationMailerHelper
  def event_time(event)
    event.start.date_time.strftime('%H:%M:%S %A %d %b %Y')
  end
end
