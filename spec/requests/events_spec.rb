require 'rails_helper'

RSpec.describe 'Events', type: :request do
  before do
    # Disable authentication filters
    allow_any_instance_of(EventsController).to receive(:check_authentication) { true }
    allow_any_instance_of(EventsController).to receive(:refresh_token) { true }
  end

  describe 'POST /events' do
    let!(:room) { create(:conference_room) }
    let(:event_attributes) { attributes_for(:event, conference_room_id: room.id) }

    before do
      allow_any_instance_of(EventsController).to receive(:session) { {credentials: 123} }
    end

    context 'given invalid event attributes' do
      let(:error) { Google::Apis::ClientError.new('error') }
      it 'responds with 422' do
        allow_any_instance_of(GoogleCalendar::GoogleEvent).to receive(:create).with(any_args).and_raise(error)
        post events_path, params: { event: event_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'given invalid conference room id' do
      let(:error) { ActiveRecord::RecordNotFound.new('Cannot find')}
      it 'responds with 422' do
        allow_any_instance_of(GoogleCalendar::GoogleEvent).to receive(:create).and_raise(error)
        post events_path, params: { event: event_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'google server does not respond' do
      let(:error) { Google::Apis::ServerError.new('error') }
      it 'responds with 503' do
        allow_any_instance_of(GoogleCalendar::GoogleEvent).to receive(:create).with(any_args).and_raise(error)
        post events_path, params: { event: event_attributes }
        expect(response).to have_http_status(:service_unavailable)
      end
    end

    context 'user is not authorized' do
      let(:error) { Google::Apis::AuthorizationError.new('error') }
      it 'responds with 401' do
        allow_any_instance_of(GoogleCalendar::GoogleEvent).to receive(:create).with(any_args).and_raise(error)
        post events_path, params: { event: event_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'successfully added new event' do
      let(:event_id) { 'id1' }
      before do
        allow_any_instance_of(GoogleCalendar::GoogleEvent).to receive(:create).with(any_args) { { id: event_id } }
      end

      it 'repond with 200' do
        post events_path, params: { event: event_attributes }
        expect(response).to have_http_status(:created)
      end

      context 'with event.confimed' do
        it 'confirms event' do
          expect do
            post events_path, params: { event: event_attributes.merge(confirmed: true) }
          end.to change { Event.confirmed.count }.by(1)
          expect(Event.confirmed.find_by_event_id(event_id)).to be_present
        end
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
      post confirm_conference_room_event_path(conference_room_id, event_id)
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
        post finish_conference_room_event_path(conference_room_id, event_id)
      end
      it { is_expected.to have_http_status :ok }
    end

    describe 'google_event_client raises ActiveRecord::RecordNotFound' do
      before do
        allow(client).to receive(:finish) { raise ActiveRecord::RecordNotFound }
        post finish_conference_room_event_path(conference_room_id, event_id)
      end
      it { is_expected.to have_http_status :unprocessable_entity }
    end
  end

  describe 'PATCH /conference_rooms/:conference_room_id/events/:event_id' do
    let(:event_id) { '1' }
    let(:conference_room_id) { '1' }
    let(:client) { double('client') }
    let(:event) { double('event', id: event_id, to_h: {}) }
    subject { response }
    before { allow_any_instance_of(EventsController).to receive(:google_event_client) { client } }

    before do
      allow(client).to receive(:update) { event }
      patch conference_room_event_path(conference_room_id, event_id), params: {event:{end_time: DateTime.now.rfc3339}}
    end

    it 'updates event' do
      expect(client).to have_received(:update)
    end

    it 'returns information about event\'s confirmation' do
      expect(JSON.parse(response.body).key?('confirmed')).to eq true
    end
  end
end
