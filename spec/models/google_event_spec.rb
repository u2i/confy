require 'rails_helper'

RSpec.describe GoogleCalendar::GoogleEvent do
  let(:credentials) { 'credentials' }
  let(:user_email) { 'email@example.com' }
  let(:google_event) { described_class.new(credentials, user_email) }
end
