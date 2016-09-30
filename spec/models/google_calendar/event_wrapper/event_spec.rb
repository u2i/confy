require 'rails_helper'

describe GoogleCalendar::EventWrapper::Event do
  let(:id) { 1 }
  let(:summary) { 'sample_summary' }
  let(:attendees) { [] }
  let(:google_event) { double('google_event', id: id, summary: summary, attendees: attendees) }
  let(:conference_room) { build(:conference_room) }
  let(:default_wrapper) { described_class.new(google_event, conference_room) }
  let(:default_google_event) { default_wrapper.google_event }

  describe '.new' do
    subject { described_class.new(google_event, conference_room) }
    it { is_expected.to be_instance_of described_class }
  end

  describe '#valid?' do
    let(:google_event) { double('event', start: starting, end: ending) }
    let(:event) { described_class.new(google_event, conference_room) }
    subject { event.valid? }

    context 'google_event has start and end fields' do
      let(:starting) { double('start', date_time: '2016-01-01') }
      let(:ending) { double('end', date_time: '2016-01-02') }

      it { is_expected.to be true }
    end

    context 'google_event does not have start and end fields' do
      let(:starting) { nil }
      let(:ending) { nil }

      it { is_expected.to be false }
    end
  end

  describe '#google_event' do
    subject { default_google_event.summary }
    it { is_expected.to eq summary }
  end

  describe '#all_day?' do
    let(:google_event) { double('google_event', start: start) }
    subject { described_class.new(google_event, conference_room).all_day? }

    context 'given google_event without start.date' do
      let(:start) { double('start', date: nil) }

      it { is_expected.to eq false }
    end

    context 'given google_event with start.date' do
      let(:start) { double('start', date: Date.today) }

      it { is_expected.to eq true }
    end
  end

  describe '#in_progress?' do
    let(:current_time) { DateTime.now }
    let(:start_time) { double('start_time', date_time: start_date_time) }
    let(:end_time) { double('end_time', date_time: end_date_time) }
    let(:google_event) { double('google_event', start: start_time, end: end_time) }

    before { allow(default_wrapper).to receive(:current_time) { current_time } }

    subject { default_wrapper.in_progress? }
    context 'event did not start' do
      let(:start_date_time) { current_time + 1.hours }
      let(:end_date_time) { current_time + 2.hours }

      it { is_expected.to eq false }
    end

    context 'event has finished' do
      let(:start_date_time) { current_time - 2.hours }
      let(:end_date_time) { current_time - 1.hours }

      it { is_expected.to eq false }
    end

    context 'event is taking place' do
      let(:start_date_time) { current_time - 1.hours }
      let(:end_date_time) { current_time + 1.hours }

      it { is_expected.to eq true }
    end
  end
end
