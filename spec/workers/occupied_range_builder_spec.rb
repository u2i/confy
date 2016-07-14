require 'rails_helper'
describe OccupiedRangeBuilder do
  describe '.occupied_slots_per_wday' do
    let!(:room1) { create :conference_room }
    let!(:room2) { create :conference_room }

    let(:start_time1) { Time.now.beginning_of_day }
    let(:start_time2) { Time.now.beginning_of_day + 1.hours }
    let(:start_time3) { Time.now.beginning_of_day + 6.hours }

    let(:end_time1) { start_time1 + 3.hours }
    let(:end_time2) { start_time2 + 4.hours }
    let(:end_time3) { start_time3 + 2.hours }

    let(:event1) do
      build :event, start_time: start_time1, end_time: end_time1, conference_room: room1
    end
    let(:event2) do
      build :event, start_time: start_time2, end_time: end_time2, conference_room: room2
    end
    let(:event3) do
      build :event, start_time: start_time3, end_time: end_time3, conference_room: room1
    end

    let(:reservations) do
      {
          start_time1.wday => [event1, event2, event3]
      }
    end

    let(:expected_result1) do
      {
          start_time1.wday => [start_time2..end_time1]
      }
    end

    let(:expected_result2) do
      {
          start_time1.wday => []
      }
    end

    it 'should return totally occupied slots per day' do
      expect(described_class.occupied_slots_per_wday(reservations.clone)).to eq expected_result1
      create :conference_room
      expect(described_class.occupied_slots_per_wday(reservations)).to eq expected_result2
    end
  end
end
