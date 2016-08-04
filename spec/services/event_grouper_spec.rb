require 'rails_helper'

RSpec.describe EventGrouper do
  describe '.group_into_blocks' do
    let(:start_time) { Time.new(2016, 1, 1, 6, 0, 0) }
    let!(:room1) { create(:conference_room) }
    let!(:room2) { create(:conference_room) }

    let!(:event1) do
      {start: {date_time: start_time},
       end: {date_time: start_time + 1.hours}}
    end

    context 'with mutually colliding events' do
      let!(:event2) do
        {start: {date_time: start_time + 30.minutes},
         end: {date_time: start_time + 2.hours}}
      end
      let!(:event3) do
        {start: {date_time: start_time + 1.hours},
         end: {date_time: start_time + 2.hours}}
      end
      let!(:event4) do
        {start: {date_time: start_time + 2.hours},
         end: {date_time: start_time + 3.hours}}
      end
      let!(:event5) do
        {start: {date_time: start_time + 3.hours},
         end: {date_time: start_time + 5.hours}}
      end

      let(:expected_events) { [[event1, event2, event3], [event4], [event5]] }

      subject(:events) { described_class.new([event1, event2, event3, event4, event5]).build_blocks }
      it 'groups overlapping events' do
        expect(events).to match_array(expected_events)
      end
    end

    context 'with pairwise colliding events' do
      let!(:event2) do
        {start: {date_time: start_time - 1.hours},
         end: {date_time: start_time + 2.hours}}
      end
      let!(:event3) do
        {start: {date_time: start_time + 1.hours},
         end: {date_time: start_time + 3.hours}}
      end

      let(:expected_events) { [[event2, event1, event3]] }

      subject(:events) { described_class.new([event1, event2, event3]).build_blocks }
      it 'groups overlapping events into one block' do
        expect(events).to match_array(expected_events)
      end
    end

    context 'colliding events seperated by another block' do
      let!(:event2) do
        {start: {date_time: start_time + 2.hours},
         end: {date_time: start_time + 3.hours}}
      end
      let!(:event3) do
        {start: {date_time: start_time},
         end: {date_time: start_time + 4.hours}}
      end
      let(:expected_events) { [[event1, event2, event3]] }

      subject(:events) { described_class.new([event1, event3, event2]).build_blocks }
      it 'groups overlapping events into one block' do
        expect(events[0]).to match_array(expected_events[0])
      end
    end
  end
end
