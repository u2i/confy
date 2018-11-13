require 'rails_helper'

RSpec.describe 'Api::Events', type: :request do
  let(:headers) { AuthHelper.device_auth }

  describe 'GET /api/events' do
    let(:calendar_service) { double }
    let(:service_account_client) { double }
    let(:email) { ENV.fetch('APPLICATION_OWNER') }
    let(:conference_room) { create :conference_room }
    let(:with_confirmation) { true }

    subject do
      get api_events_path, headers: headers, params: {
        conference_room_id: conference_room.id,
        confirmation: with_confirmation
      }
    end

    context 'when events are returned' do
      before do
        expect(GoogleOauth)
          .to receive(:push_notification_client) { calendar_service }
        expect(GoogleCalendar::GoogleEvent)
          .to receive(:new).with(calendar_service: calendar_service, user_email: email) { service_account_client }
        expect(service_account_client)
          .to receive(:find_by_room).with(TimeInterval::TimeIntervalRFC3339, conference_room.id, with_confirmation) { [] }
      end

      it_behaves_like 'successfull request'
    end

    it_behaves_like 'unauthenticated request'
  end
end
