require 'rails_helper'

describe GoogleCalendar::EventWrapper::Builder do
  let!(:room) { create :conference_room }
  let(:default_params) { {id: '1'} }
  before(:each) { @builder = described_class.new(default_params.merge params) }

  describe '#attendees' do
    let(:user_email) { 'mail@example.com' }
    let(:params) { {conference_room_id: room.id, user_email: user_email, attendees: []} }
    subject { @builder.send(:attendees) }

    it do
      is_expected.to satisfy do |attendees|
        attendees.any? { |attendee| attendee.email == room.email && attendee.response_status == 'accepted' }
      end
    end

    it do
      is_expected.to satisfy do |attendees|
        attendees.any? { |attendee| attendee.email == user_email && attendee.response_status == 'accepted' }
      end
    end
  end

  describe '#location' do
    subject { @builder.send(:location) }

    context 'given conference_room_id' do
      let(:params) { {conference_room_id: room.id} }

      it { is_expected.to eq room.title }
    end

    context 'not given conference_room_id' do
      let(:params) { {} }

      it { is_expected.to eq '' }
    end
  end
end
