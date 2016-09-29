class ConfirmationMailer < ApplicationMailer
  add_template_helper(ConfirmationMailerHelper)

  def unconfirmed_event_email(event)
    @event = event
    mail(to: event.creator.email, subject: 'You forgot to confirm your event')
  end
end
