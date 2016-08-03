require 'rails_helper'

class Adding
  extend GoogleCalendar::Adding
end

describe Adding do
  describe '.event_in_span' do
    let(:service) { double(:calendar_service) }
    let(:credentials) { :credentials }
    let(:conference_room) { {email: 'email@sample.com'.freeze, key: :value} }
    let(:start_time) { Time.now }
    let(:end_time) { Time.now + 3.hour }

    before do
      allow(described_class).to receive(:calendar_service) { service }
    end

    it 'calls calendar_service' do
      expect(described_class).to receive(:calendar_service).with(credentials)
      expect(service).to receive(:list_events).with(conference_room[:email],
                                                    time_min: start_time,
                                                    time_max: end_time)
      described_class.events_in_span(credentials, conference_room, start_time, end_time)
    end
  end

  describe '.add_room_to_event' do
    context 'given valid conference room id' do
      let(:mordor_email) { 'u2i.com_2d3631343934393033313035@resource.calendar.google.com' }
      let!(:first_room) { create(:conference_room, email: mordor_email) }
      let(:expected_result) do
        {
          attendees: [
            {email: mordor_email}
          ],
          location: first_room.title
        }
      end
      let(:params) { {} }
      it 'adds attendess and location keys with appropriate values' do
        described_class.add_room_to_event(params, first_room.id)
        expect(params).to eq expected_result
      end
    end

    context 'given invalid conference room id' do
      let(:invalid_id) { 1 }
      let(:params) { {} }
      it 'raises GoogleCalendar::AddEventInvalidRoom error' do
        allow(ConferenceRoom).to receive(:find_by) { nil }
        expect { described_class.add_room_to_event(params, invalid_id) }.
          to raise_error(GoogleCalendar::Adding::AddEventInvalidRoom)
      end
    end
  end

  describe 'EVENT_SCHEMA' do
    let(:schema) { GoogleCalendar::Adding::EVENT_SCHEMA }
    let(:time1) { Faker::Time.forward 5 }
    let(:time2) { Faker::Time.forward 5 }
    let(:params) { {start: {date_time: time1}, end: {date_time: time2}} }
    context 'valid' do
      it { expect(schema.call(params).success?).to eq true }
    end
    context 'no start' do
      it 'is invalid' do
        expect(schema.call(end: {date_time: 'asdf'}).messages[:start]).to be_present
      end
    end
    context 'no end' do
      it 'is invalid' do
        expect(schema.call(start: {date_time: 'asdf'}).messages[:end]).to be_present
      end
    end

    context 'no end datetime' do
      it 'is invalid' do
        expect(schema.call(start: {date_time: time1}, end: {test: nil}).messages[:end]).to be_present
      end
    end
    context 'no start datetime' do
      it 'is invalid' do
        expect(schema.call(end: {date_time: time1}, start: {test: nil}).messages[:start]).to be_present
      end
    end
  end

  describe '.create' do
    context 'given invalid params' do
      let(:invalid_event_response) { [false, {start: ['is missing'], end: ['is missing']}] }
      it 'raises GoogleCalendar::AddEventInvalidParamsError' do
        expect { described_class.create({}, 0, {}) }.to raise_error(GoogleCalendar::Adding::AddEventInvalidParamsError)
      end
    end

    context 'valid params' do
      context 'other events exitis' do
        let(:credentials) { :credentials }
        let(:first_event) { double('Event', summary: 'Summary') }
        let(:second_event) { double('Event', summary: 'Meeting') }
        let(:start_time) { Time.now }
        let(:end_time) { Time.now + 3.hour }
        let(:event_data) do
          {
            attendees: [],
            start: {date_time: start_time},
            end: {date_time: end_time}
          }
        end
        let!(:room) { create :conference_room }

        before do
          allow(described_class).to receive(:events_in_span) do
            double('EventList', items: [first_event, second_event])
          end
        end

        it 'raises AddEventInTimeSpanError' do
          expect do
            described_class.create(credentials,
                                   room.id,
                                   start: {date_time: start_time},
                                   end: {date_time: end_time})
          end.to raise_error(GoogleCalendar::Adding::AddEventInTimeSpanError,
                             'Already 2 events in time span(Summary, Meeting).')
        end
      end
      context 'no other events' do
        let(:credentials) { :credentials }
        let(:service) { double(:calendar_service) }
        let(:start_time) { Time.now }
        let(:end_time) { Time.now + 3.hour }
        let(:event_data) do
          {
            attendees: [],
            start: {date_time: start_time},
            end: {date_time: end_time}
          }
        end
        let!(:room) { create :conference_room }

        before do
          allow(described_class).to receive(:events_in_span) do
            double('EventList', items: [])
          end
          allow(described_class).to receive(:calendar_service) { service }
          allow(service).to receive(:insert_event) { true }
        end
        it 'creates event' do
          expect(service).to receive(:insert_event).with(
            'primary',
            Google::Apis::CalendarV3::Event
          )
          described_class.create(credentials,
                                 room.id,
                                 start: {date_time: start_time},
                                 end: {date_time: end_time})
        end
      end
    end
  end
end
