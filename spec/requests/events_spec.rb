require 'rails_helper'

RSpec.describe 'Events', type: :request do
  before do
    # Disable authentication filters
    allow_any_instance_of(EventsController).to receive(:check_authentication) { true }
    allow_any_instance_of(EventsController).to receive(:refresh_token) { true }
  end

  describe 'POST /events' do
    before do
      allow(GoogleCalendar::EventDataService).to receive(:process_params) { |arg| arg }
      allow_any_instance_of(EventsController).to receive(:event_params) { {conference_room_id: 2} }
      allow_any_instance_of(EventsController).to receive(:session) { {credentials: 123} }
    end

    context 'given invalid event attributes' do
      let(:error) { Google::Apis::ClientError.new('error') }
      it 'responds with 422' do
        allow_any_instance_of(GoogleCalendar::GoogleEvent).to receive(:create).with(any_args).and_raise(error)
        post events_path
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'given invalid conference room id' do
      let(:error) { GoogleCalendar::GoogleEventWrapper::EventInvalidRoom.new('error') }
      it 'responds with 422' do
        allow_any_instance_of(GoogleCalendar::GoogleEvent).to receive(:create).and_raise(error)
        post events_path
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'google server does not respond' do
      let(:error) { Google::Apis::ServerError.new('error') }
      it 'responds with 503' do
        allow_any_instance_of(GoogleCalendar::GoogleEvent).to receive(:create).with(any_args).and_raise(error)
        post events_path
        expect(response).to have_http_status(:service_unavailable)
      end
    end

    context 'user is not authorized' do
      let(:error) { Google::Apis::AuthorizationError.new('error') }
      it 'responds with 401' do
        allow_any_instance_of(GoogleCalendar::GoogleEvent).to receive(:create).with(any_args).and_raise(error)
        post events_path
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'successfully added new event' do
      it 'repond with 200' do
        allow_any_instance_of(GoogleCalendar::GoogleEvent).to receive(:create).with(any_args) { {} }
        post events_path
        expect(response).to have_http_status(:created)
      end
    end
  end

  describe 'DELETE /event' do
    let(:event_id) { 'test_event_id' }
    let(:session) { {credentials: 'test_credentials'} }
    context 'request is forbidden' do
      let(:error) { Google::Apis::ClientError.new('forbidden error') }
      it 'responds with 403' do
        allow_any_instance_of(GoogleCalendar::GoogleEvent).to receive(:delete).and_raise(error)
        allow_any_instance_of(EventsController).to receive(:session) { session }
        delete event_path event_id
        expect(response).to have_http_status :forbidden
      end
    end
    context 'request is valid' do
      it 'redirects to root_path' do
        allow_any_instance_of(GoogleCalendar::GoogleEvent).to receive(:delete) { true }
        allow_any_instance_of(EventsController).to receive(:session) { session }
        delete event_path event_id
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
