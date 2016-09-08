require 'rails_helper'

RSpec.describe Event, type: :model do
  describe 'validation' do
    subject { build :event }

    %i{event_id conference_room_id}.each do |s|
      it { is_expected.to validate_presence_of s }
    end

    it { is_expected.to validate_uniqueness_of :event_id }
  end

  context 'scopes' do
    let!(:unconfirmed_event) { create :event }
    let!(:confirmed_event) { create :event, confirmed: true }
    describe '.confirmed' do
      subject { described_class.confirmed }
      it { is_expected.to eq [confirmed_event] }
    end

    describe '.confirmed_event_ids' do
      subject { described_class.confirmed_event_ids }
      it { is_expected.to eq [confirmed_event.event_id] }
    end
  end

  describe '#confirm' do
    subject { event.confirmed }
    before { event.confirm }

    context 'event is not saved in database' do
      let(:event) { build :event }
      it { is_expected.to eq true }
    end

    context 'event is saved in database' do
      let!(:event) { create :event }
      it { is_expected.to eq true }
    end
  end

  describe '.confirm_or_create' do
    context 'given event_id that does not exist in db' do
      let(:event_id) { 'invalid_event_id' }

      context 'given invalid conference_room_id' do
        let(:conference_room_id) { 0 }
        subject { -> { described_class.confirm_or_create(conference_room_id, event_id) } }
        it { is_expected.to raise_error(ActiveRecord::RecordNotFound) }
      end

      context 'given valid conference_room_id' do
        let!(:conference_room) { create :conference_room }

        it 'creates new confirmed event' do
          described_class.confirm_or_create(conference_room.id, event_id)
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
        described_class.confirm_or_create(conference_room_id, event.event_id)

        expect(Event.find_by(event_id: event.event_id).confirmed).to eq true
      end
    end
  end
end
