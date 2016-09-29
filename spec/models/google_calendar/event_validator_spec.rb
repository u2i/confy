require 'rails_helper'

RSpec.describe GoogleCalendar::EventValidator do
  let!(:conference_room) { create(:conference_room) }
  let(:client) { double(:client) }
  let(:service) { double(:calendar_service) }
  let(:credentials) { :credentials }
  let(:user_email) { 'mail@example.com'.freeze }
  let(:event_id) { 'sample_id' }
  let(:start_time) { Time.now }
  let(:end_time) { Time.now + 3.hours }
  let(:event) do
    double('event',
           id: event_id,
           conference_room: conference_room,
           start: double('start', date_time: start_time),
           end: double('end', date_time: end_time))
  end
  let(:event_finder) { double('event_finder') }

  before do
    allow(GoogleCalendar::EventFinder).to receive(:new) { event_finder }
  end

  subject { described_class.new(event, credentials, user_email) }
  describe '#raise_if_occupied' do
    context 'with no colliding events' do
      before do
        allow(event_finder).to receive(:by_room).and_return([])
      end

      it 'does not raise any errors' do
        expect { subject.raise_if_occupied }.not_to raise_error
      end
    end

    context 'with colliding event' do
      let(:colliding_event) { { id: 'another_id', summary: 'Event' } }

      before do
        allow(event_finder).to receive(:by_room).and_return([colliding_event])
      end

      it 'raises EventInTimeSpanError' do
        expect { subject.raise_if_occupied }.to raise_error(GoogleCalendar::EventValidator::EventInTimeSpanError)
                                                  .with_message('Already 1 event in time span (Event).')
      end
    end

    context 'with event already saved to google' do
      let(:google_event) { { id: event_id } }

      before do
        allow(event_finder).to receive(:by_room).and_return([google_event])
      end

      it 'does not raise any errors' do
        expect { subject.raise_if_occupied }.not_to raise_error
      end
    end
  end

  describe '#raise_if_params_invalid' do
    context 'with invalid event' do
      before { allow(event).to receive(:valid?).and_return(false) }

      it 'raises EventInvalidParamsError' do
        expect { subject.raise_if_params_invalid }.to raise_error(GoogleCalendar::EventValidator::EventInvalidParamsError)
      end
    end

    context 'with valid event' do
      before { allow(event).to receive(:valid?).and_return(true) }

      it 'raises EventInvalidParamsError' do
        expect { subject.raise_if_params_invalid }.not_to raise_error
      end
    end
  end
end
