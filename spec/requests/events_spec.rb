require 'rails_helper'

RSpec.describe 'Events', type: :request do
  before do
    # Disable authentication filters
    allow_any_instance_of(EventsController).to receive(:check_authentication) { true }
    allow_any_instance_of(EventsController).to receive(:refresh_token) { true }
  end

  describe 'POST /events' do
    before do
      allow_any_instance_of(EventsController).to receive(:create_event_params) { {conference_room_id: 2} }
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
      let(:error) { ActiveRecord::RecordNotFound.new('Cannot find')}
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

  describe 'POST /events/confirm' do
    let(:event_id) { '1' }
    let(:conference_room_id) { '1' }

    it 'calls google_event_client.confirm with given parameters' do
      expect(Event).to receive(:confirm_or_create).with(conference_room_id, event_id)
      post confirmation_path(conference_room_id, event_id)
    end
  end

  describe 'POST /conference_rooms/events/finish' do
    let(:event_id) { '1' }
    let(:conference_room_id) { '1' }
    let(:client) { double('client') }
    subject { response }
    before { allow_any_instance_of(EventsController).to receive(:google_event_client) { client } }
    describe 'given valid data' do
      before do
        allow(client).to receive(:finish) { true }
        post finish_path(conference_room_id, event_id)
      end
      it { is_expected.to have_http_status :ok }
    end

    describe 'google_event_client raises ActiveRecord::RecordNotFound' do
      before do
        allow(client).to receive(:finish) { raise ActiveRecord::RecordNotFound }
        post finish_path(conference_room_id, event_id)
      end
      it { is_expected.to have_http_status :bad_request }
    end
  end
end
