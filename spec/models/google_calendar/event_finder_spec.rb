
require 'rails_helper'

describe GoogleCalendar::EventFinder do
  let(:client) { double(:client) }
  let(:service) { double(:calendar_service) }
  let(:credentials) { :credentials }
  let(:user_email) { 'example@com' }
  let(:event_finder) { described_class.new(service, user_email) }
  let(:rooms) { ConferenceRoom.all }

  before do
    allow(client).to receive(:calendar_service) { service }
    allow(GoogleCalendar::Client).to receive(:new) { client }
  end

  describe '.all' do
    let!(:sample_conference_room1) { create :conference_room }
    let!(:sample_conference_room2) { create :conference_room }
    let(:sample_summary) { 'Nice summary' }
    let(:sample_email) { 'email@example.com' }

    let(:google_event1) do
      Google::Apis::CalendarV3::Event.new(start: Google::Apis::CalendarV3::EventDateTime.new(date_time: start_time1),
                                          creator: Google::Apis::CalendarV3::Event::Creator.new(display_name: 'User'),
                                          end: Google::Apis::CalendarV3::EventDateTime.new(date_time: end_time1),
                                          summary: 'Event1', description: sample_summary,
                                          attendees: [Google::Apis::CalendarV3::EventAttendee.new(self: true, response_status: 'accepted')])
    end

    let(:google_event2) do
      Google::Apis::CalendarV3::Event.new(
        start: Google::Apis::CalendarV3::EventDateTime.new(date_time: start_time2),
        creator: Google::Apis::CalendarV3::Event::Creator.new(display_name: 'User'),
        end: Google::Apis::CalendarV3::EventDateTime.new(date_time: end_time2),
        summary: 'Event2', description: sample_summary,
        attendees: [Google::Apis::CalendarV3::EventAttendee.new(self: true, response_status: 'accepted')])
    end

    let(:sample_events) do
      [google_event1, google_event2]
    end

    let(:expected_events) { [google_event1, google_event2] }

    before do
      events = double('events')

      allow(GoogleOauth).to receive(:user_email) { 'example@com' }
      allow(events).to receive(:items) { sample_events }
      allow(service).to receive(:batch).and_yield(service)
      allow(service).to receive(:list_events) do |email, &block|
        if email == ConferenceRoom.first.email
          block.call [double('EventList', items: [google_event1]), nil]
        else
          block.call [double('EventList', items: [google_event2]), nil]
        end
      end
    end

    let(:time_interval) { double('time_interval', starting: start_time1, ending: start_time2) }
    context 'rejected event' do
      let(:start_time1) { DateTime.now.beginning_of_week }
      let(:start_time2) { DateTime.now.beginning_of_week + 1.day }
      let(:end_time1) { start_time1 + 2.hours }
      let(:end_time2) { start_time2 + 2.hours }

      context 'room rejected event' do
        before do
          google_event1.attendees.first.response_status = described_class::GOOGLE_EVENT_DECLINED_RESPONSE
        end
        it 'ignores event' do
          expect(event_finder.all(time_interval)).to satisfy do |response|
            response[1].blank?
          end
        end
      end
      context 'someone else rejected event' do
        before do
          google_event1.attendees.push(
            Google::Apis::CalendarV3::EventAttendee.new(
              response_status: described_class::GOOGLE_EVENT_DECLINED_RESPONSE
            )
          )
        end
        it 'adds event' do
          expect(event_finder.all(time_interval)).to satisfy do |response|
            response.each_with_index.all? do |event, i|
              event[:summary] == expected_events[i].summary
            end
          end
        end
      end
    end

    context 'events start and end in granularity' do
      let(:start_time1) { DateTime.now.beginning_of_week }
      let(:start_time2) { DateTime.now.beginning_of_week + 1.days }
      let(:end_time1) { start_time1 + 2.hours }
      let(:end_time2) { start_time2 + 2.hours }

      it 'returns array of events' do
        expect(event_finder.all(time_interval)).to satisfy do |response|
          response.each_with_index.all? do |event, i|
            event[:summary] == expected_events[i].summary
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
        response = event_finder.all(time_interval)
        expect(response[0][:rounded_start_time]).to eq DateTime.now.beginning_of_week
        expect(response[0][:rounded_end_time]).to eq DateTime.now.beginning_of_week + 3.hours
        expect(response[1][:rounded_start_time]).to eq DateTime.now.beginning_of_week + 1.days + 30.minutes
        expect(response[1][:rounded_end_time]).to eq DateTime.now.beginning_of_week + 1.days + 2.hours + 30.minutes
      end
    end

    context 'event for whole day' do
      let(:start_time1) { DateTime.now.beginning_of_week }
      let(:end_time1) { start_time1 + 1.day }
      let(:start_time2) { DateTime.now.beginning_of_week + 1.days }
      let(:end_time2) { start_time2 + 2.hours }
      before do
        google_event1.start = Google::Apis::CalendarV3::EventDateTime.new(date: start_time1.to_date)
        google_event1.end = Google::Apis::CalendarV3::EventDateTime.new(date: end_time1.to_date)
      end
      it 'normalizes event' do
        response = event_finder.all(time_interval)
        expect(response[0][:start][:date_time]).to eq start_time1
        expect(response[0][:end][:date_time]).to eq end_time1
      end
    end
  end

  describe '.rooms' do
    let!(:conference_room1) { create :conference_room }
    let!(:conference_room2) { create :conference_room }
    let!(:conference_room3) { create :conference_room }
    context 'without param' do
      it 'returns all conference rooms' do
        expect(event_finder.send(:rooms).size).to eq(3)
      end
    end

    context 'with conference_room_ids array' do
      let(:conference_room_ids) { [conference_room1.id] }
      it 'returns only specified conference rooms' do
        result = event_finder.send(:rooms, conference_room_ids)
        expect(result.size).to eq(1)
        expect(result[0]).to eq(conference_room1)
      end
    end
  end

  describe '#confirmed_events' do
    let(:id1) { 'id1' }
    let(:id2) { 'id2' }
    let(:confirmed_event_ids) { [id1] }
    let(:confirmed_event) {{ id: id1 }}
    let(:unconfirmed_event) {{ id: id2 }}

    before do
      allow(Event).to receive(:confirmed_event_ids) { [id1] }
      allow(event_finder).to receive(:all) { [confirmed_event, unconfirmed_event] }
    end

    subject { event_finder.confirmed_events(nil) }
    it { is_expected.to eq [confirmed_event] }
  end

  describe '#by_room' do
    let(:event_id) { 'sampleid'.freeze }
    let!(:room) { create(:conference_room) }
    let(:start_time) { Time.now }
    let(:end_time) { start_time + 1.hour }
    let(:event_start) { Google::Apis::CalendarV3::EventDateTime.new(date_time: start_time) }
    let(:event_creator) { Google::Apis::CalendarV3::Event::Creator.new(display_name: 'User') }
    let(:event_end) { Google::Apis::CalendarV3::EventDateTime.new(date_time: end_time) }
    let(:event_attendees) do
      [Google::Apis::CalendarV3::EventAttendee.new(self: true, response_status: 'accepted')]
    end
    let(:event_summary) { 'Event1' }
    let(:event_description) { 'Description' }
    let(:google_event) do
      Google::Apis::CalendarV3::Event.new(start: event_start,
                                          creator: event_creator,
                                          end: event_end,
                                          summary: event_summary,
                                          description: event_description,
                                          attendees: event_attendees).tap { |event| event.id = event_id }
    end
    let(:time_interval) { double('time_interval', starting: start_time, ending: end_time) }

    before do
      events = double('events')
      allow(GoogleOauth).to receive(:user_email) { 'example@com' }
      allow(events).to receive(:items) { [event] }
      allow(service).to receive(:batch).and_yield(service)
      allow(service).to receive(:list_events) do |email, &block|
        block.call [double('EventList', items: [google_event]), nil]
      end
    end

    subject { event_finder.by_room(time_interval, [room.id]) }

    it 'gets events from room' do
      expect(subject.first[:summary]).to eq google_event.summary
    end

    context 'with_confirmation == false' do
      subject { event_finder.by_room(time_interval, [room.id]) }

      it 'does not set confirmed field' do
        expect(subject.first.key?(:confirmed)).to eq false
      end
    end

    context 'with_confirmation' do
      subject { event_finder.by_room(time_interval, [room.id], true) }
      context 'event not confirmed' do
        it 'sets confirmed field to false' do
          expect(subject.first[:confirmed]).to eq false
        end
      end

      context 'event confirmed' do
        let!(:confirmed_event) do
          create(:event, confirmed: true, event_id: google_event.id, conference_room_id: room.id)
        end

        it 'sets confirmed field to true' do
          expect(subject.first[:confirmed]).to eq true
        end
      end
    end
  end
end
