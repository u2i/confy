require 'rails_helper'

RSpec.describe GoogleCalendar::GoogleEvent do
  let(:credentials) { 'credentials' }
  let(:user_email) { 'email@example.com' }
  let(:google_event) { described_class.new(credentials, user_email) }

  describe '#confirm' do
    context 'given event_id that doest not exist in db' do
      let(:event_id) { 'invalid_event_id' }

      context 'given invalid conference_room_id' do
        let(:conference_room_id) { 0 }
        it 'raises ActiveRecord::RecordNotFound' do
          expect { google_event.confirm(conference_room_id, event_id) }.to raise_error(ActiveRecord::RecordNotFound)
        end
      end

      context 'given valid conference_room_id' do
        let!(:conference_room) { create :conference_room }

        it 'creates new confirmed event' do
          google_event.confirm(conference_room.id, event_id)
          created_event = conference_room.events.first

          expect(created_event.event_id).to eq event_id
          expect(created_event.confirmed).to eq true
        end
      end
    end

    context 'given event_id that exists in db' do
      let!(:event) { create :event }
      let(:conference_room_id) { event.conference_room.id }

      it 'confirms event' do
        google_event.confirm(conference_room_id, event.event_id)

        expect(Event.find_by(event_id: event.event_id).confirmed).to eq true
      end
    end
  end
end
