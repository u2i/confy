require 'rails_helper'

RSpec.describe GoogleCalendar::EventCreator do
  let(:client) { double(:client) }
  let(:service) { double(:calendar_service) }
  let(:credentials) { :credentials }
  let(:event_creator) { described_class.new(credentials) }
  before do
    allow(client).to receive(:calendar_service) { service }
    allow(GoogleCalendar::Client).to receive(:new) { client }
  end
  describe '.events_in_span' do
    let(:conference_room) { {email: 'email@sample.com'.freeze, key: :value} }
    let(:start_time) { Time.now }
    let(:end_time) { Time.now + 3.hour }

    it 'calls calendar_service' do
      expect(service).to receive(:list_events)
      event_creator.send(:events_in_span, conference_room, start_time, end_time)
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
        described_class.new(credentials).send(:add_room_to_event, params, first_room.id)
        expect(params).to eq expected_result
      end
    end

    context 'given invalid conference room id' do
      let(:invalid_id) { 1 }
      let(:params) { {} }
      it 'raises GoogleCalendar::Adding::EventInvalidRoom error' do
        allow(ConferenceRoom).to receive(:find_by) { nil }
        expect { described_class.new(credentials).send(:add_room_to_event, params, invalid_id) }.
          to raise_error(GoogleCalendar::EventCreator::EventInvalidRoom)
      end
    end
  end

  describe 'EVENT_SCHEMA' do
    let(:schema) { GoogleCalendar::EventCreator::EVENT_SCHEMA }
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
      it 'raises GoogleCalendar::Adding::EventInvalidParamsError' do
        expect { described_class.new(credentials).create(0, {}) }.
          to raise_error(GoogleCalendar::EventCreator::EventInvalidParamsError)
      end
    end

    context 'valid params' do
      context 'other events exists' do
        let!(:room) { create :conference_room }
        let(:credentials) { :credentials }
        context 'events are not declined' do
          let(:attendee) { double('Attendee', self: true, response_status: 'accepted') }
          let(:first_event) { double('Event', summary: 'Summary', attendees: [attendee]) }
          let(:second_event) { double('Event', summary: 'Meeting', attendees: [attendee]) }
          let(:start_time) { Time.now }
          let(:end_time) { Time.now + 3.hour }
          let(:event_data) do
            {
              attendees: [],
              start: {date_time: start_time},
              end: {date_time: end_time}
            }
          end

          before do
           allow(service).to receive(:list_events) { double(items: [first_event, second_event]) }
          end

          it 'raises EventInTimeSpanError' do
            expect do
              event_creator.create(room.id, start: {date_time: start_time}, end: {date_time: end_time})
            end.to raise_error(GoogleCalendar::EventCreator::EventInTimeSpanError,
                               'Already 2 events in time span(Summary, Meeting).')
          end
        end

        context 'events are declined' do
          let(:attendee) do
            double(
              'Attendee',
              self: true,
              response_status: GoogleCalendar::EventFinder::GOOGLE_EVENT_DECLINED_RESPONSE
            )
          end
          let(:first_event) { double('Event', summary: 'Summary', attendees: [attendee]) }
          let(:second_event) { double('Event', summary: 'Meeting', attendees: [attendee]) }
          let(:start_time) { Time.now }
          let(:end_time) { Time.now + 3.hour }
          let(:event_data) do
            {
              attendees: [],
              start: {date_time: start_time},
              end: {date_time: end_time}
            }
          end
          let(:service) { double(:calendar_service) }

          before do
            allow(service).to receive(:list_events) { double(items: [first_event, second_event]) }
            allow(event_creator).to receive(:calendar_service) { service }
            allow(service).to receive(:insert_event) { true }
          end

          it 'creates event' do
            expect(service).to receive(:insert_event).with(
              'primary',
              Google::Apis::CalendarV3::Event
            )
            event_creator.create(room.id, start: {date_time: start_time}, end: {date_time: end_time})
          end

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
          allow(event_creator).to receive(:events_in_span) { [] }
          allow(event_creator).to receive(:calendar_service) { service }
          allow(service).to receive(:insert_event) { true }
        end
        it 'creates event' do
          expect(service).to receive(:insert_event).with(
            'primary',
            Google::Apis::CalendarV3::Event
          )
          event_creator.create(room.id, start: {date_time: start_time}, end: {date_time: end_time})
        end
      end
    end
  end
end
