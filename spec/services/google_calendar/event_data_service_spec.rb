require 'rails_helper'

RSpec.describe GoogleCalendar::EventDataService do
  describe '.whole_day_event?' do
    let(:event) { double('event', start: start) }
    context 'given even with empty start.date property' do
      let(:start) { double('start', date: '') }
      it 'returns false' do
        expect(described_class.whole_day_event?(event)).to eq(false)
      end
    end
    context 'given event with non-empty start.date property' do
      let(:start) { double('start', date: 'non-empty') }
      it 'returns true' do
        expect(described_class.whole_day_event?(event)).to eq(true)
      end
    end
  end

  describe '.normalize_event_datetime' do
    let(:start_date_string) { '2016-01-01' }
    let(:end_date_string) { '2016-01-03' }
    let(:start) { double('start', date: start_date_string, date_time: '') }
    let(:ending) { double('ending', date: end_date_string, date_time: '') }
    let(:event) { double('event', start: start, end: ending) }
    let(:expected_start_result) { Date.parse(start_date_string).beginning_of_day.to_datetime }
    let(:expected_end_result) { Date.parse(end_date_string).beginning_of_day.to_datetime }
    context 'given whole day event' do
      it 'sets events start.date_time and end.date_time attributes to the beginning of day datetime objects' do
        allow(described_class).to receive(:whole_day_event?) { true }
        expect(start).to receive(:date_time=).with(expected_start_result)
        expect(ending).to receive(:date_time=).with(expected_end_result)
        expect(described_class.normalize_event_datetime(event)).to eq [expected_start_result, expected_end_result]
      end
    end

    context 'given not a whole day event' do
      let(:expected_start_result) { 'result1' }
      let(:expected_end_result) { 'result2' }
      before do
        allow(TimeRound).to receive(:floor_time).with(event.start.date_time) { expected_start_result }
        allow(TimeRound).to receive(:ceil_time).with(event.end.date_time) { expected_end_result }
      end
      it 'sets events start.date_time and end.date_time attributes to the result of TimeRound methods' do
        allow(described_class).to receive(:whole_day_event?) { false }
        expect(described_class.normalize_event_datetime(event)).to eq [expected_start_result, expected_end_result]
      end
    end
  end
end
