require 'rails_helper'

RSpec.describe Event, type: :model do

  describe 'validation' do
    let(:event) { build :event }

    %i(start_time end_time user location).each do |s|
      it { is_expected.to validate_presence_of s}
    end

    it "must ensure that start_time is lower than end_time" do
      event.end_time = event.start_time - 10
      expect(event).not_to be_valid
      expect(event.errors[:start_time]).to be_present
      event.end_time = event.start_time + 20.minutes
      expect(event).to be_valid
    end
  end

  describe '.in_week' do
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
end
