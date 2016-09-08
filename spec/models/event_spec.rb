require 'rails_helper'

RSpec.describe Event, type: :model do
  describe 'validation' do
    subject { build :event }

    %i{event_id conference_room_id}.each do |s|
      it { is_expected.to validate_presence_of s }
    end

    it { is_expected.to validate_uniqueness_of :event_id }
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
end
