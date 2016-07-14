require 'rails_helper'

describe GoogleEvent do
  describe '.list_events' do
    let!(:sample_conference_room1) do
      create :conference_room
    end
    let!(:sample_conference_room2) do
      create :conference_room
    end
    let(:sample_time1) do
      DateTime.now.beginning_of_week
    end
    let(:sample_time2) do
      DateTime.now.beginning_of_week + 1.days
    end
    let(:sample_end_time1) do
      sample_time1 + 2.hours
    end
    let(:sample_end_time2) do
      sample_time2 + 2.hours
    end

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
        1 => [sample_event1],
        2 => [sample_event2]
      }
    end

    it 'returns list of events where ints are keys and Array[Event] are values' do
      service = double('service')
      events = double('events')

      allow(events).to receive(:items) { sample_events }
      allow(GoogleEvent).to receive(:calendar_service) { service }
      allow(service).to receive(:batch).and_yield(service)
      allow(service).to receive(:list_events) do |email, &block|
        if email == ConferenceRoom.first.email
          block.call [double('EventList', items: [google_event1]), nil]
        else
          block.call [double('EventList', items: [google_event2]), nil]
        end
      end

      expect(GoogleEvent.list_events('', sample_time1, sample_time1)).to satisfy do |response|
        response.all? do |day, _|
          response[day].each_with_index.all? do |event, i|
            event.attributes == expected_events[day][i].attributes
          end
        end
      end
    end
  end
end
