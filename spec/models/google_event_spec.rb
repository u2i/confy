require 'rails_helper'

describe GoogleEvent do
  describe '.list_events' do
    let!(:sample_conference_room1) { create :conference_room }
    let!(:sample_conference_room2) { create :conference_room }
    let(:sample_time1) { DateTime.now.beginning_of_week }
    let(:sample_time2) { DateTime.now.beginning_of_week + 1.days }
    let(:sample_end_time1) { sample_time1 + 2.hours }
    let(:sample_end_time2) { sample_time2 + 2.hours }

    let(:sample_event1) do
      build :event, start_time: sample_time1, end_time: sample_end_time1, conference_room: sample_conference_room1, user: 'name', description: sample_summary
    end
    let(:sample_event2) do
      build :event, start_time: sample_time2, end_time: sample_end_time2, conference_room: sample_conference_room2, user: 'name', description: sample_summary
    end

    let(:sample_summary) { 'Nice summary' }

    let(:google_event1) do
      Google::Apis::CalendarV3::Event.new(start: Google::Apis::CalendarV3::EventDateTime.new(date_time: sample_event1.start_time),
                                          creator: Google::Apis::CalendarV3::Event::Creator.new(display_name: sample_event1.user),
                                          end: Google::Apis::CalendarV3::EventDateTime.new(date_time: sample_event1.end_time),
                                          summary: sample_event1.name, description: sample_summary)
    end
    let(:google_event2) do
      Google::Apis::CalendarV3::Event.new(start: Google::Apis::CalendarV3::EventDateTime.new(date_time: sample_event2.start_time),
                                          creator: Google::Apis::CalendarV3::Event::Creator.new(display_name: sample_event2.user),
                                          end: Google::Apis::CalendarV3::EventDateTime.new(date_time: sample_event2.end_time),
                                          summary: sample_event2.name, description: sample_summary)
    end
    let(:sample_events) do
      [google_event1, google_event2]
    end

    let(:expected_events) do
      {
        1 => [google_event1],
        2 => [google_event2]
      }
    end

    it 'remove array of events' do
      service = double('service')
      events = double('events')

      allow(events).to receive(:items) { sample_events }
      allow(described_class).to receive(:calendar_service) { service }
      allow(service).to receive(:batch).and_yield(service)
      allow(service).to receive(:list_events) do |email, &block|
        if email == ConferenceRoom.first.email
          block.call [double('EventList', items: [google_event1]), nil]
        else
          block.call [double('EventList', items: [google_event2]), nil]
        end
      end

      expect(described_class.list_events('', sample_time1, sample_time1)).to satisfy do |response|
        response.all? do |day, _|
          response[day].each_with_index.all? do |event, i|
            event[:summary] == expected_events[day][i].summary
          end
        end
      end
    end
  end

  describe '.create' do
    context 'given invalid params' do
      let(:invalid_event_response) { [false, {start: ['is missing'], end: ['is missing']}] }
      it 'raises GoogleEvent::InvalidParamsException' do
        expect { described_class.create({}, 0, {}) }.to raise_error(GoogleEvent::InvalidParamsError)
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

        it 'raises EventInTimeSpanError' do
          expect do
            described_class.create(credentials,
                                   room.id,
                                   start: {date_time: start_time},
                                   end: {date_time: end_time})
          end.to raise_error(
            GoogleEvent::EventInTimeSpanError,
            'Already 2 events in time span(Summary, Meeting).'
          )
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

  describe 'EVENT_SCHEMA' do
    let(:schema) { GoogleEvent::EVENT_SCHEMA }
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

  describe '.add_rooms_to_event' do
    context 'given array of calendar room ids' do
      let(:mordor_email) { 'u2i.com_2d3631343934393033313035@resource.calendar.google.com' }
      let(:neverland_email) { 'u2i.com_3530363130383730383638@resource.calendar.google.com' }
      let(:expected_result) do
        {
          attendees: [
            {email: mordor_email}
          ],
          location: first_room.title
        }
      end
      let(:params) { {} }
      let!(:first_room) { create(:conference_room, email: mordor_email) }
      it 'adds new key in hash and assigns array of conference room emails to it' do
        described_class.add_room_to_event(params, first_room.id)
        expect(params).to eq expected_result
      end
    end
  end

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
end
