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
end
