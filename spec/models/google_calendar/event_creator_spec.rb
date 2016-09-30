require 'rails_helper'

RSpec.describe GoogleCalendar::EventCreator do
  let(:client) { double(:client) }
  let(:service) { double(:calendar_service, batch: nil) }
  let(:credentials) { :credentials }
  let(:event_creator) { described_class.new(credentials) }
  let!(:conference_room) { create(:conference_room) }
  before do
    allow(client).to receive(:calendar_service) { service }
    allow(GoogleCalendar::Client).to receive(:new) { client }
  end

  describe '.create' do
    context 'given invalid params' do
      it 'raises GoogleCalendar::EventValidator::EventInvalidParamsError' do
        expect { described_class.new(credentials).create({conference_room_id: conference_room.id}) }.
          to raise_error(GoogleCalendar::EventValidator::EventInvalidParamsError)
      end
    end

    context 'valid params' do
      context 'other events exists' do
        let(:credentials) { :credentials }
        let(:first_event) { {summary: 'Summary'} }
        let(:second_event) { {summary: 'Meeting'} }
        let(:start_time) { Time.now }
        let(:end_time) { Time.now + 3.hour }
        let!(:room) { create :conference_room }
        let(:event_data) do
          {
            attendees: [],
            start_time: start_time.to_s,
            end_time: end_time.to_s,
            conference_room_id: room.id
          }
        end

        before do
          allow_any_instance_of(GoogleCalendar::EventValidator).to receive(:raise_if_occupied)
            .and_raise(GoogleCalendar::EventValidator::EventInTimeSpanError)
        end

        it 'raises EventInTimeSpanError' do
          expect do
            event_creator.create(event_data)
          end.to raise_error(GoogleCalendar::EventValidator::EventInTimeSpanError)
        end
      end

      context 'no other events' do
        let(:credentials) { :credentials }
        let(:service) { double(:calendar_service) }
        let(:start_time) { Time.now }
        let(:end_time) { Time.now + 3.hour }
        let!(:room) { create :conference_room }
        let(:event_data) { {attendees: [], start_time: start_time, end_time: end_time, conference_room_id: conference_room.id} }

        before do
          allow_any_instance_of(GoogleCalendar::EventValidator).to receive(:raise_if_invalid)
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
