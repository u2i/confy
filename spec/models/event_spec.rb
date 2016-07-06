require 'rails_helper'

RSpec.describe Event, type: :model do

  describe 'validation' do
    let(:event) { build :event }

    %i(start_time end_time user location).each do |s|
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

  describe '#in_week' do
    let(:start_time) { Time.now.beginning_of_week }
    let!(:expected_events) {
      [
        create(:event, start_time: start_time - 2.days, end_time: start_time + 2.days),
        create(:event, start_time: start_time - 2.days, end_time: start_time + 10.days),
        create(:event, start_time: start_time + 1.days, end_time: start_time + 10.days),
        create(:event, start_time: start_time, end_time: start_time + 2.hours),
        create(:event, start_time: start_time + 1.days, end_time: start_time + 1.days + 2.hours)
      ]
    }
    let!(:not_expected_events) {
      [
        create(:event, start_time: start_time - 2.days, end_time: start_time - 2.days + 1.hours)
      ]
    }

    it "returns all events from specified week" do
      expect(described_class.in_week(start_time)).to match_array expected_events
    end

  end

  describe '#in_week_group_by_weekday' do
    let(:start_time) { Time.now.beginning_of_week }
    let!(:event1) { create(:event, start_time: start_time, end_time: start_time + 2.hours) }
    let!(:event2) { create(:event, start_time: start_time + 1.hour, end_time: start_time + 2.hours) }
    let!(:event3) { create(:event, start_time: start_time + 1.days, end_time: start_time + 2.days) }
    let!(:event4) { create(:event, start_time: start_time + 3.days, end_time: start_time + 4.days) }

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

    it "returns all events from specified week grouped by weekday" do
      events = described_class.in_week_group_by_weekday(start_time)
      expect(events).to include expected_events
      expect(events).not_to include not_expected_events
    end
  end
end
