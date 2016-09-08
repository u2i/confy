require 'rails_helper'

describe GoogleCalendar::EventWrapper::RoundedEvent do
  let(:start_date) { Date.parse('2016-01-01') }
  let(:end_date) { Date.parse('2016-01-02') }
  let(:start) { double('start', date: start_date, date_time: start_date.to_datetime) }
  let(:ending) { double('ending', date: end_date, date_time: end_date.to_datetime) }
  let(:event) { GoogleCalendar::EventWrapper::RoundedEvent.new(params) }

  describe 'initialization' do
    let(:expected_start_result) { start_date.beginning_of_day.to_datetime }
    let(:expected_end_result) { end_date.beginning_of_day.to_datetime }
    context 'given whole day event' do
      let(:params) { {start: start, end: ending, all_day: true} }
      it 'sets events start_time.date_time and end_time.date_time attributes to the beginning of day' do
        expect(start).to receive(:date_time=).with expected_start_result
        expect(ending).to receive(:date_time=).with expected_end_result
        GoogleCalendar::EventWrapper::RoundedEvent.new(params)
      end
    end

    context 'given not a whole day event' do
      let(:params) { {start: start, end: ending, all_day: false} }
      let(:expected_start_result) { 'result1' }
      let(:expected_end_result) { 'result2' }
      before do
        allow(TimeRound).to receive(:floor_time).with(start.date_time) { expected_start_result }
        allow(TimeRound).to receive(:ceil_time).with(ending.date_time) { expected_end_result }
      end
      it 'sets events start.date_time and end.date_time attributes to the result of TimeRound methods' do
        expect(event.rounded_start_time).to eq expected_start_result
        expect(event.rounded_end_time).to eq expected_end_result
      end
    end
  end
end
