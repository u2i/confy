require 'rails_helper'

RSpec.describe EventGrouper do

  describe '.group_into_blocks' do
    let(:start_time) { Time.new(2016, 1, 1, 6, 0, 0) }
    let!(:room1) { create(:conference_room) }
    let!(:room2) { create(:conference_room) }

    let!(:event1) { create(:event, start_time: start_time, end_time: start_time + 1.hour, conference_room: room1) }

    context 'with mutually colliding events' do
      let!(:event2) do
        create(:event,
               start_time: start_time + 30.minutes,
               end_time: start_time + 2.hours,
               conference_room: room2)
      end
      let!(:event3) do
        create(:event,
               start_time: start_time + 1.hour,
               end_time: start_time + 2.hours,
               conference_room: room1)
      end
      let!(:event4) do
        create(:event, start_time: start_time + 2.hours,
               end_time: start_time + 3.hours,
               conference_room: room1)
      end
      let!(:event5) do
        create(:event,
               start_time: start_time + 3.hours,
               end_time: start_time + 5.hours,
               conference_room: room1)
      end

      let(:expected_events) { [[event1, event2, event3], [event4], [event5]] }

      subject(:events) { described_class.new(Event.all).call }
      it 'groups overlapping events' do
        expect(events).to match_array(expected_events)
      end
    end

    context 'with pairwise colliding events' do
      let!(:event2) do
        create(:event,
               start_time: start_time - 1.hour,
               end_time: start_time + 2.hours,
               conference_room: room1)
      end
      let!(:event3) do
        create(:event,
               start_time: start_time + 1.hour,
               end_time: start_time + 3.hours,
               conference_room: room2)
      end

      let(:expected_events) { [[event2, event1, event3]] }

      subject(:events) { described_class.new(Event.all).call }
      it 'groups overlapping events into one block' do
        expect(events).to match_array(expected_events)
      end
    end
  end
end
