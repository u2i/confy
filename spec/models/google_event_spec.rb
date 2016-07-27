require 'rails_helper'

describe GoogleEvent do
  describe '.list_events' do
    let!(:sample_conference_room1) { create :conference_room }
    let!(:sample_conference_room2) { create :conference_room }
    let(:sample_summary) { 'Nice summary' }

    let(:google_event1) do
      Google::Apis::CalendarV3::Event.new(start: Google::Apis::CalendarV3::EventDateTime.new(date_time: start_time1),
                                          creator: Google::Apis::CalendarV3::Event::Creator.new(display_name: 'User'),
                                          end: Google::Apis::CalendarV3::EventDateTime.new(date_time: end_time1),
                                          summary: 'Event1', description: sample_summary)
    end

    let(:google_event2) do
      Google::Apis::CalendarV3::Event.new(start: Google::Apis::CalendarV3::EventDateTime.new(date_time: start_time2),
                                          creator: Google::Apis::CalendarV3::Event::Creator.new(display_name: 'User'),
                                          end: Google::Apis::CalendarV3::EventDateTime.new(date_time: end_time2),
                                          summary: 'Event2', description: sample_summary)
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

    before do
      service = double('service')
      events = double('events')

      allow(GoogleOauth).to receive(:user_email) { 'example@com' }
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
    end

    context 'events start and end in granularity' do
      let(:start_time1) { DateTime.now.beginning_of_week }
      let(:start_time2) { DateTime.now.beginning_of_week + 1.days }
      let(:end_time1) { start_time1 + 2.hours }
      let(:end_time2) { start_time2 + 2.hours }

      it 'returns array of events' do
        expect(described_class.list_events('', '', start_time1, start_time2)).to satisfy do |response|
          response.all? do |day, _|
            response[day].each_with_index.all? do |event, i|
              event[:summary] == expected_events[day][i].summary
            end
          end
        end
      end
    end

    context 'events start or end not in granularity' do
      let(:start_time1) { DateTime.now.beginning_of_week + 10.minutes }
      let(:start_time2) { DateTime.now.beginning_of_week + 1.days + 40.minutes }
      let(:end_time1) { start_time1.beginning_of_hour + 2.hours + 40.minutes }
      let(:end_time2) { start_time2.beginning_of_hour + 2.hours + 10.minutes }

      it 'normalizes events' do
        response = described_class.list_events('', '', start_time1, start_time2)
        expect(response[1].first[:start][:date_time]).to eq DateTime.now.beginning_of_week
        expect(response[1].first[:end][:date_time]).to eq DateTime.now.beginning_of_week + 3.hours
        expect(response[2].first[:start][:date_time]).to eq DateTime.now.beginning_of_week + 1.days + 30.minutes
        expect(response[2].first[:end][:date_time]).to eq DateTime.now.beginning_of_week + 1.days + 2.hours + 30.minutes
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

  describe '.mark_user_events' do
    let(:credentials) { {} }
    let(:user_email) { 'user@example.com' }
    let(:not_user_email) { 'not_user@example.com' }
    let(:event1) { {creator: {email: user_email}} }
    let(:event2) { {creator: {email: not_user_email}} }
    let(:all_events) { {1 => [event1, event2]} }

    it 'sets event[:creator][:self] flag to true if user is creator of the event' do
      allow(GoogleOauth).to receive(:user_email) { user_email }
      GoogleEvent.mark_user_events(user_email, all_events)
      expect(event1[:creator][:self]).to eq true
      expect(event2[:creator][:self]).to eq false
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
