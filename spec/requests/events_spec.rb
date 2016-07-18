require 'rails_helper'

RSpec.describe 'Events', type: :request do
  # describe 'POST /events' do
  #   let!(:conference_room) { create(:conference_room) }
  #
  #   context 'with valid event' do
  #     let(:event) { attributes_for :event, conference_room_id: conference_room.id }
  #
  #     before { post events_path, params: {event: event} }
  #
  #     it 'should respond with 200' do
  #       expect(response).to have_http_status(:created)
  #       expect(response.content_type).to eq('application/json')
  #     end
  #   end
  #
  #   context 'with invalid event' do
  #     let(:event) { attributes_for :event, user: '', conference_room_id: conference_room.id }
  #
  #     before { post events_path, params: {event: event} }
  #
  #     it 'should respond with 422' do
  #       expect(response).to have_http_status(:unprocessable_entity)
  #     end
  #   end
  #
  #   context 'with colliding event' do
  #     let!(:start_time) { Time.now }
  #     let!(:valid_event) do
  #       create(:event,
  #              start_time: start_time,
  #              end_time: start_time + 1.hour,
  #              conference_room_id: conference_room.id)
  #     end
  #     let(:invalid_event) do
  #       attributes_for(:event,
  #                      start_time: start_time,
  #                      end_time: start_time + 1.hour,
  #                      conference_room_id: conference_room.id)
  #     end
  #     let(:event) { invalid_event }
  #
  #     before { post events_path, params: {event: event} }
  #
  #     it 'should respond with 422' do
  #       expect(response).to have_http_status(:unprocessable_entity)
  #     end
  #   end
  # end
end
