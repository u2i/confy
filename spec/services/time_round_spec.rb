require 'rails_helper'

RSpec.describe TimeRound do
  describe '.floor_time' do
    context 'granularity past hour' do
      let(:time) { Time.now.beginning_of_hour + TimeRound::GRANULARITY }

      it 'returns argument' do
        expect(described_class.floor_time(time)).to eq time
      end
    end

    context 'half granularity past hour' do
      let(:time) { Time.now.beginning_of_hour + TimeRound::GRANULARITY / 2 }

      it 'floors time' do
        expect(described_class.floor_time(time)).to eq time.beginning_of_hour
      end
    end
  end

  describe '.ceil_time' do
    context 'granularity past hour' do
      let(:time) { Time.now.beginning_of_hour + TimeRound::GRANULARITY }

      it 'returns argument' do
        expect(described_class.ceil_time(time)).to eq time
      end
    end

    context 'half granularity past hour' do
      let(:time) { Time.now.beginning_of_hour + TimeRound::GRANULARITY / 2 }

      it 'ceils time' do
        expect(described_class.ceil_time(time)).to eq(time.beginning_of_hour + TimeRound::GRANULARITY)
      end
    end
  end
end
