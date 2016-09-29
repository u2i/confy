# Preview all emails at http://localhost:3000/rails/mailers/confirmation_mailer
class ConfirmationMailerPreview < ActionMailer::Preview
  def unconfirmed_event_email
    event = GoogleCalendar::EventWrapper::Builder.new(summary: 'Sample Event',
                                                      start_time: Time.now,
                                                      html_link: 'https://google.com').build_event_wrapper
    ConfirmationMailer.unconfirmed_event_email('user@example.com', event)
  end
end
