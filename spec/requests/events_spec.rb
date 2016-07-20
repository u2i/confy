require 'rails_helper'

RSpec.describe 'Events', type: :request do
  describe 'POST /events' do
    context 'given invalid event attributes' do
      let(:exception) { Google::Apis::ClientError.new('error') }
      it 'responds with 422' do
        allow(GoogleEvent).to receive(:create).with(any_args).and_raise(exception)
        allow(GoogleEvent).to receive(:process_params) { |arg| arg }
        allow_any_instance_of(EventsController).to receive(:event_params) { {conference_room_id: 2} }
        allow_any_instance_of(EventsController).to receive(:session) { {credentials: 123} }
        post events_path
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'google server does not respond' do
      let(:exception) { Google::Apis::ServerError.new('error') }
      it 'responds with 503' do
        allow(GoogleEvent).to receive(:create).with(any_args).and_raise(exception)
        allow(GoogleEvent).to receive(:process_params) { |arg| arg }
        allow_any_instance_of(EventsController).to receive(:event_params) { {conference_room_id: 2} }
        allow_any_instance_of(EventsController).to receive(:session) { {credentials: 123} }
        post events_path
        expect(response).to have_http_status(:service_unavailable)
      end
    end

    context 'user is not authorized' do
      let(:exception) { Google::Apis::AuthorizationError.new('error') }
      it 'responds with 401' do
        allow(GoogleEvent).to receive(:create).with(any_args).and_raise(exception)
        allow(GoogleEvent).to receive(:process_params) { |arg| arg }
        allow_any_instance_of(EventsController).to receive(:event_params) { {conference_room_id: 2} }
        allow_any_instance_of(EventsController).to receive(:session) { {credentials: 123} }
        post events_path
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'successfully added new event' do
      it 'repond with 200' do
        allow(GoogleEvent).to receive(:create).with(any_args) { {} }
        allow(GoogleEvent).to receive(:process_params) { |arg| arg }
        allow_any_instance_of(EventsController).to receive(:event_params) { {conference_room_id: 2} }
        allow_any_instance_of(EventsController).to receive(:session) { {credentials: 123} }
        post events_path
        expect(response).to have_http_status(:created)
      end
    end
  end
end
