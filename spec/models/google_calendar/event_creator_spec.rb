require 'rails_helper'

RSpec.describe GoogleCalendar::EventCreator do
  let(:client) { double(:client) }
  let(:service) { double(:calendar_service) }
  let(:credentials) { :credentials }
  let(:email) { 'mail@example.com'.freeze }
  let(:event_creator) { described_class.new(credentials, email) }
  before do
    allow(client).to receive(:calendar_service) { service }
    allow(GoogleCalendar::Client).to receive(:new) { client }
  end
  describe '.events_in_span' do
    let(:conference_room) { build(:conference_room) }
    let(:start_time) { Time.now }
    let(:end_time) { Time.now + 3.hour }

    it 'calls calendar_service' do
      expect(service).to receive(:list_events).with(conference_room.email,
                                                    time_min: start_time,
                                                    time_max: end_time)
      event_creator.send(:events_in_span, conference_room, start_time, end_time)
    end
  end

  describe '.create' do
    context 'given invalid params' do
      it 'raises GoogleCalendar::Adding::EventInvalidParamsError' do
        expect { described_class.new(credentials, email).create({}) }.
          to raise_error(GoogleCalendar::EventCreator::EventInvalidParamsError)
      end
    end

    context 'valid params' do
      context 'other events exists' do
        let(:credentials) { :credentials }
        let(:first_event) { double('Event', summary: 'Summary') }
        let(:second_event) { double('Event', summary: 'Meeting') }
        let(:start_time) { Time.now }
        let(:end_time) { Time.now + 3.hour }
        let!(:room) { create :conference_room }
        let(:event_data) do
          {
            attendees: [],
            start_time: start_time,
            end_time: end_time,
            conference_room_id: room.id
          }
        end

        before do
          allow(event_creator).to receive(:events_in_span) { [first_event, second_event] }
        end

        it 'raises EventInTimeSpanError' do
          expect do
            event_creator.create(event_data)
          end.to raise_error(GoogleCalendar::EventCreator::EventInTimeSpanError,
                             'Already 2 events in time span(Summary, Meeting).')
        end
      end

      context 'no other events' do
        let(:credentials) { :credentials }
        let(:service) { double(:calendar_service) }
        let(:start_time) { Time.now }
        let(:end_time) { Time.now + 3.hour }
        let!(:room) { create :conference_room }
        let(:event_data) { {attendees: [], start_time: start_time, end_time: end_time} }

        before do
          allow(event_creator).to receive(:events_in_span) { [] }
          allow(event_creator).to receive(:calendar_service) { service }
          allow(service).to receive(:insert_event) { true }
        end
        it 'creates event' do
          expect(service).to receive(:insert_event).with(
            'primary',
            Google::Apis::CalendarV3::Event,
            send_notifications: true
          )
          event_creator.create(event_data)
        end
      end
    end
  end
end
