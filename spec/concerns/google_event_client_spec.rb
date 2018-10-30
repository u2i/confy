require 'rails_helper'

describe GoogleEventClient do
  let(:test_class) { Struct.new(:session) { include GoogleEventClient } }
  let(:session) { { credentials: '{}', email: '' } }
  let(:test_instance) { test_class.new(session) }

  describe '.google_event_client' do
    it 'returns GoogleCalendar::GoogleEvent instance' do
      expect(test_instance.google_event_client).to be_a(GoogleCalendar::GoogleEvent)
    end
  end

  describe '.service_account_client' do
    it 'returns GoogleCalendar::GoogleEvent instance' do
      expect(test_instance.service_account_client).to be_a(GoogleCalendar::GoogleEvent)
    end
  end
end
