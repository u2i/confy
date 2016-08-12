require 'rails_helper'

describe GoogleCalendar::EventFinder do
  let(:client) { double(:client) }
  let(:service) { double(:calendar_service) }
  let(:credentials) { :credentials }
  let(:user_email) { 'example@com' }
  let(:event_finder) { described_class.new(credentials, user_email) }

  before do
    allow(client).to receive(:calendar_service) { service }
    allow(GoogleCalendar::Client).to receive(:new) { client }
  end

  describe '.list_events' do
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
          expect(event_finder.list_events(time_interval)).to satisfy do |response|
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
          expect(event_finder.list_events(time_interval)).to satisfy do |response|
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
        expect(event_finder.list_events(time_interval)).to satisfy do |response|
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
        response = event_finder.list_events(time_interval)
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
        google_event1.start = Google::Apis::CalendarV3::EventDateTime.new(date: start_time1.to_date.to_s)
        google_event1.end = Google::Apis::CalendarV3::EventDateTime.new(date: end_time1.to_date.to_s)
      end
      it 'normalizes event' do
        response = event_finder.list_events(time_interval)
        expect(response[0][:start][:date_time]).to eq start_time1
        expect(response[0][:end][:date_time]).to eq end_time1
      end
    end
  end

  describe '.mark_user_events' do
    let(:credentials) { {} }
    let(:user_email) { 'user@example.com' }
    let(:not_user_email) { 'not_user@example.com' }
    let(:event1) { {creator: {email: user_email}} }
    let(:event2) { {creator: {email: not_user_email}} }
    let(:all_events) { [event1, event2] }

    it 'sets event[:creator][:self] flag to true if user is creator of the event' do
      allow(GoogleOauth).to receive(:user_email) { user_email }
      event_finder.send(:mark_user_events, all_events)
      expect(event1[:creator][:self]).to eq true
      expect(event2[:creator][:self]).to eq false
    end
  end
end
