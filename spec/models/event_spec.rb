require 'rails_helper'

RSpec.describe Event, type: :model do

  describe 'validation' do
    %i(start_time end_time user location).each do |s|
      it { is_expected.to validate_presence_of s}
    end

    it "start_time must be lower than end_time" do
      start_time = Time.now
      end_time = start_time - 10
      event = Event.new description: "123", user: "user", location: "location", start_time: start_time, end_time: end_time
      expect(event).not_to be_valid
      expect(event.errors[:start_time]).to be_present
      event.end_time = Time.now
      expect(event).to be_valid
    end
  end
end
