require 'rails_helper'

RSpec.describe GoogleCalendar::GoogleErrorHandler do
  SampleClass = Class.new.include(described_class)

  context 'block raises ArgumentError' do
    let(:message) { 'My message' }
    subject { SampleClass.new.rescue_google_request { raise ArgumentError, message } }

    it 'changes error to GoogleAuthenticationError' do
      expect { subject }.to raise_error(GoogleCalendar::GoogleErrorHandler::GoogleAuthenticationError, message)
    end
  end

  context 'block raises other error' do
    let(:message) { 'Other message' }
    subject { SampleClass.new.rescue_google_request { raise StandardError, message } }
    it 'does nothing' do
      expect { subject }.to raise_error(StandardError, message)
    end
  end
end
