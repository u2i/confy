require 'rails_helper'

RSpec.describe GoogleCalendar::EventEditor do
  let!(:conference_room) { create :conference_room }
  let(:credentials) { }
  let(:service) { double('service') }
  let(:client) { double('client', calendar_service: service) }
  before do
    allow(GoogleCalendar::Client).to receive(:new) { client }
  end
  let(:event_editor) { described_class.new(credentials) }

  describe '#finish' do
    let(:start_time) { double('start_time', date_time: start_date_time) }
    let(:end_time) { double('end_time', date_time: end_date_time) }
    let(:event) { double('event', start: start_time, end: end_time, id: 1) }
    let(:current_time) { DateTime.now }
    subject { event_editor }
    before do
      allow(end_time).to receive(:date_time=)
      allow(event_editor).to receive(:get_event) { event }
      allow(event_editor).to receive(:update_event)
      allow(event_editor).to receive(:current_time) { current_time }

      event_editor.finish(conference_room.id, 1)
    end
    context 'event did not start' do
      let(:start_date_time) { current_time + 1.hours }
      let(:end_date_time) { current_time + 2.hours }

      it { is_expected.not_to have_received :update_event }
    end

    context 'event has finished' do
      let(:start_date_time) { current_time - 2.hours }
      let(:end_date_time) { current_time - 1.hours }

      it { is_expected.not_to have_received :update_event }
    end

    context 'event is taking place' do
      let(:start_date_time) { current_time - 1.hours }
      let(:end_date_time) { current_time + 1.hours }

      it { is_expected.to have_received :update_event }
    end
  end
end
