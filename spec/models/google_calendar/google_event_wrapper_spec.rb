require 'rails_helper'

describe GoogleCalendar::GoogleEventWrapper do
  let(:default_params) {{ id: '1', summary: 'sample_summary' }}
  let(:default_wrapper) { described_class.new(default_params) }
  let(:default_google_event) { default_wrapper.as_google_event }

  describe '.new' do
    it 'creates new GoogleEventWrapper' do
      expect(described_class.new).to be_instance_of described_class
    end
  end

  describe '#valid?' do
    context 'given start_time and end_time in params' do
      let(:params) { {start_time: '2016-01-01', end_time: '2016-01-02'} }
      it 'returns true' do
        expect(described_class.new(params).valid?).to eq true
      end
    end
  end

  describe '#as_google_event' do
    it 'returns Google::Apis::CalendarV3::Event instance' do
      expect(described_class.new.as_google_event).to be_instance_of Google::Apis::CalendarV3::Event
    end

    it 'returns Google::Apis::CalendarV3::Event instance with attributes' do
      expect(default_google_event.id).to eq default_params[:id]
      expect(default_google_event.summary).to eq default_params[:summary]
    end

    let!(:room) { create :conference_room }
    let(:creator_email) { 'mail@example.com' }
    let(:params) {{ id: '1', conference_room_id: room.id, creator_email: creator_email }}
    let(:google_event) { described_class.new(params).as_google_event }

    it 'adds conference room with accepted response status to attendees' do
      expect(google_event.attendees).to include({ email: room.email, response_status: 'accepted' })
    end

    it 'adds creator email with accepted response to attendees' do
      expect(google_event.attendees).to include({ email: creator_email, response_status: 'accepted' })
    end
  end
end
