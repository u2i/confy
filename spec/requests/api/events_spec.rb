require 'rails_helper'

RSpec.describe 'API::Events', type: :request do
  describe 'GET /api/events' do
    let(:calendar_service) { double }
    let(:service_account_client) { double }
    let(:email) { ENV.fetch('APPLICATION_OWNER') }

    subject { get api_events_path }

    before do
      expect(GoogleOauth)
        .to receive(:push_notification_client) { calendar_service }
      expect(GoogleCalendar::GoogleEvent)
        .to receive(:new).with(calendar_service: calendar_service, user_email: email) { service_account_client }
      expect(service_account_client)
        .to receive(:all).with(TimeInterval::TimeIntervalRFC3339) { [] }
    end

    it 'responds with 200' do
      subject
      expect(response).to have_http_status(:success)
    end
  end
end
