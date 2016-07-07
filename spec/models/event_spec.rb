require 'rails_helper'

RSpec.describe Event, type: :model do
  let(:room) { create :conference_room }

  describe 'validation' do
    let(:event) { build :event }

    %i(start_time end_time user conference_room).each do |s|
      it { is_expected.to validate_presence_of s }
    end


    it "must ensure that start_time is lower than end_time" do
      event.end_time = event.start_time - 10
      expect(event).not_to be_valid
      expect(event.errors[:start_time]).to be_present
      event.end_time = event.start_time + 20.minutes
      expect(event).to be_valid
    end
  end

  describe '.in_span' do
    let(:start_time) { Time.now.beginning_of_week }
    let!(:expected_events) {
      [
        create(:event, start_time: start_time - 2.days, end_time: start_time + 2.days, conference_room: room),
        create(:event, start_time: start_time - 2.days, end_time: start_time + 10.days, conference_room: room),
        create(:event, start_time: start_time + 1.days, end_time: start_time + 10.days, conference_room: room),
        create(:event, start_time: start_time, end_time: start_time + 2.hours, conference_room: room),
        create(:event, start_time: start_time + 1.days, end_time: start_time + 1.days + 2.hours, conference_room: room)
      ]
    }
    let!(:not_expected_events) {
      [
        create(:event, start_time: start_time - 2.days, end_time: start_time - 2.days + 1.hours, conference_room: room)
      ]
    }

    it "returns all events from specified week" do
      expect(described_class.in_span(start_time.beginning_of_week, start_time.end_of_week)).to match_array expected_events
    end
  end

  describe '.in_week' do

    let(:start_time) { Time.now.beginning_of_week }

    it 'calls .in_span with correct arguemnts' do
      expect(described_class).to receive(:in_span).with(start_time.beginning_of_week, start_time.end_of_week)
      described_class.in_week(start_time)
    end
  end

  describe '.in_week_group_by_weekday' do
    let(:start_time) { Time.now.beginning_of_week }
    let!(:event1) { create(:event, start_time: start_time, end_time: start_time + 2.hours, conference_room: room) }
    let!(:event2) { create(:event, start_time: start_time + 1.hour, end_time: start_time + 2.hours, conference_room: room) }
    let!(:event3) { create(:event, start_time: start_time + 1.days, end_time: start_time + 2.days, conference_room: room) }
    let!(:event4) { create(:event, start_time: start_time + 3.days, end_time: start_time + 4.days, conference_room: room) }

    let(:expected_events) do
      {
        event1.start_time.wday => [event1, event2],
        event3.start_time.wday => [event3]
      }
    end

    let(:not_expected_events) {
      {
        9 => [event4]
      }
    }

    subject(:events) { described_class.in_week_group_by_weekday(start_time) }
    it "returns all events from specified week grouped by weekday" do
      expect(events).to include expected_events
      expect(events).not_to include not_expected_events
    end
  end
end
