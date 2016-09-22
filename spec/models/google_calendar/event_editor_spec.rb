require 'rails_helper'

WithDatetime = Struct.new(:date_time)

RSpec.describe GoogleCalendar::EventEditor do
  let!(:room) { create(:conference_room) }
  let(:start_time) { DateTime.now - 5.minutes }
  let(:end_time) { start_time + 30.minutes }
  let(:event_id) { 'sample_id'.freeze }
  let!(:now) { DateTime.now }
  let(:event) do
    double('event', start: WithDatetime.new(start_time), end: WithDatetime.new(end_time), id: event_id)
  end
  let(:service) { double('service', get_event: event, update_event: nil) }
  subject { described_class.new(:credentials) }

  before do
    allow_any_instance_of(GoogleCalendar::Client).to receive(:calendar_service).and_return(service)
    allow(DateTime).to receive(:now) { now }
  end

  describe '#finish' do
    it 'changes event\'s end to current time' do
      subject.finish(room.id, event_id)
      expect(service).to have_received(:update_event).with(room.email, event_id, satisfy { |n| n.end.date_time == now })
    end
  end

  describe '#update_end_time' do
    let(:end_time) { DateTime.now + 30.minutes }
    it 'changes event\'s end time' do
      subject.update_end_time(room.id, event_id, end_time)
      expect(service).to have_received(:update_event).with(room.email, event_id, satisfy do |n|
        n.end.date_time == end_time
      end)
    end
  end
end
