require 'rails_helper'

RSpec.describe Event, type: :model do

  describe 'validation' do
    let(:event) { FactoryGirl.build :event }

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

  describe '#in_week' do
    let(:start_time) { Time.now.beginning_of_week }
    let!(:events) {
      [
          FactoryGirl.create(:event, start_time: start_time, end_time: start_time + 2.hours),
          FactoryGirl.create(:event, start_time: start_time + 1.days, end_time: start_time + 1.days + 2.hours),
          FactoryGirl.create(:event, start_time: start_time - 2.days, end_time: start_time - 2.days + 1.hours),
          FactoryGirl.create(:event, start_time: start_time - 2.days, end_time: start_time + 2.days),
          FactoryGirl.create(:event, start_time: start_time - 2.days, end_time: start_time + 10.days),
          FactoryGirl.create(:event, start_time: start_time + 1.days, end_time: start_time + 10.days)

      ]
    }

    it "returns all events from specified week" do
      expected_events = events.clone.tap { |n| n.delete_at(2) }
      expect(Event.in_week(start_time).sort).to eq expected_events.sort
    end

  end
end
