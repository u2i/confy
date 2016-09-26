require 'rails_helper'

WithDatetime = Struct.new(:date_time)

RSpec.describe GoogleCalendar::EventEditor do
  let!(:room) { create(:conference_room) }
  let!(:now) { DateTime.now }
  let(:start_time) { now - 5.minutes }
  let(:end_time) { start_time + 30.minutes }
  let(:event_id) { 'sample_id'.freeze }
  let(:event) do
    Google::Apis::CalendarV3::Event.new(start: WithDatetime.new(start_time), end: WithDatetime.new(end_time), id: event_id)
  end
  let(:service) { double('service', get_event: event, update_event: nil) }
  subject { described_class.new(:credentials, :user_email) }

  before do
    allow_any_instance_of(GoogleCalendar::Client).to receive(:calendar_service).and_return(service)
    allow_any_instance_of(GoogleCalendar::EventValidator).to receive(:raise_if_occupied)
    allow(DateTime).to receive(:now) { now }
  end

  describe '#finish' do
    it 'changes event\'s end to current time' do
      subject.finish(room.id, event_id)
      expect(service).to have_received(:update_event).with(room.email, event_id, satisfy { |n| n.end.date_time == now })
    end
  end

  describe '#update' do
    let(:start_time) { DateTime.now + 10.minutes }
    let(:end_time) { DateTime.now + 30.minutes }
    let(:summary) { 'Updated summary' }
    let(:description) { 'Updated description' }
    let(:event_data) { { start_time: start_time, end_time: end_time, summary: summary, description: description } }
    it 'updates event\'s info' do
      subject.update(room.id, event_id, event_data)
      expect(service).to have_received(:update_event).with(room.email, event_id, satisfy do |n|
        n.end.date_time == end_time &&
          n.start.date_time == start_time &&
          n.summary == summary &&
          n.description == description
      end)
    end
  end
end
