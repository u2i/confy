require 'rails_helper'

describe GoogleCalendar::EventWrapper::Event do
  let(:default_params) {{ id: '1', summary: 'sample_summary', attendees: [] }}
  let(:default_wrapper) { described_class.new(default_params) }
  let(:default_google_event) { default_wrapper.as_google_event }

  describe '.new' do
    subject { described_class.new }
    it { is_expected.to be_instance_of described_class }
  end

  describe '#valid?' do
    context 'given start_time and end_time in params' do
      let(:starting) { double('start', date_time: '2016-01-01') }
      let(:ending) { double('end', date_time: '2016-01-02') }
      let(:params) { {start: starting, end: ending} }
      let(:event) { described_class.new(params) }
      subject { event.valid? }
      it { is_expected.to be true }
    end
  end

  describe '#as_google_event' do
    it 'returns Google::Apis::CalendarV3::Event instance' do
      expect(default_wrapper.as_google_event).to be_instance_of Google::Apis::CalendarV3::Event
    end

    it 'returns Google::Apis::CalendarV3::Event instance with attributes' do
      expect(default_google_event.summary).to eq default_params[:summary]
    end

    let!(:room) { create :conference_room }
    let(:user_email) { 'mail@example.com' }
    let(:params) { {id: '1', conference_room: room, user_email: user_email, attendees: []} }
    let(:google_event) { described_class.new(params).as_google_event }

    it 'adds conference room with accepted response status to attendees' do
      expect(google_event.attendees).to satisfy do |attendees|
        attendees.any? { |attendee| attendee.email == room.email && attendee.response_status == 'accepted' }
      end
    end

    it 'adds creator email with accepted response to attendees' do
      expect(google_event.attendees).to satisfy do |attendees|
        attendees.any? { |attendee| attendee.email == user_email && attendee.response_status == 'accepted' }
      end
    end
  end

  describe '#mark_user_event' do
    let(:current_user_email) { 'example@something.com' }

    context 'creator is given' do
      let(:creator) { double('creator', email: current_user_email) }
      let(:event_wrapper) { described_class.new(creator: creator) }

      it 'sets creator.self to true' do
        allow(creator).to receive(:self)
        expect(creator).to receive(:self=).with true
        event_wrapper.mark_user_event(current_user_email)
      end
    end
  end
end
