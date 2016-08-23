require 'rails_helper'

RSpec.describe 'Notification', type: :request do
  before do
    allow(NotifyClientsJob).to receive(:perform_later) {}
  end
  describe 'POST /notify/:conference_room_id' do
    context 'with invalid conference_room_id' do
      let(:invalid_conference_room_id) { 2 }

      before do
        post notifications_path(invalid_conference_room_id)
      end

      it 'responds with 404' do
        expect(response).to have_http_status :not_found
      end
    end
    context 'with valid conference_room_id' do
      let!(:channel) { create :channel }
      let(:valid_conference_room_id) { channel.conference_room.id }

      context 'with invalid headers' do
        let(:invalid_headers) { {'X-Goog-Channel-ID' => 'invalid_header'} }

        before do
          post notifications_path(valid_conference_room_id), headers: invalid_headers
        end

        it 'responds with 400' do
          expect(response).to have_http_status :bad_request
        end
      end

      context 'with valid headers' do
        let(:valid_headers) { {'X-Goog-Channel-ID' => channel.channel_id} }

        before do
          post notifications_path(valid_conference_room_id), headers: valid_headers
        end
        
        it 'responds with 200' do
          expect(response).to have_http_status :ok
        end
      end
    end
  end
end
