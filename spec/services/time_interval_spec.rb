require 'spec_helper'

RSpec.describe TimeInterval do

  describe '.week' do
    let(:date) { Time.new(2016, 8, 2) }
    let(:week_start) { Time.new(2016, 8, 1) }
    let(:week_end) { Time.new(2016, 8, 5).end_of_day }

    subject(:time_interval) { described_class.week(date) }
    it 'creates an interval lasting exactly 5 days' do
      expect(time_interval.start).to eq(week_start)
      expect(time_interval.end).to eq(week_end)
    end
  end

  describe '.day' do
    let(:date) { Time.new(2016, 8, 2, 10) }
    let(:day_start) { date.at_beginning_of_day }
    let(:day_end) { date.at_end_of_day }

    subject(:time_interval) { described_class.day(date) }
    it 'creates an interval lasting 1 day' do
      expect(time_interval.start).to eq(day_start)
      expect(time_interval.end).to eq(day_end)
    end
  end

  describe '#collect_steps' do
    let(:interval_start) { Time.new(2016, 8, 1) }
    let(:step) { 1.day }

    let(:expected_steps) { [Time.new(2016, 8, 1), Time.new(2016, 8, 2), Time.new(2016, 8, 3)] }

    subject(:time_interval) { described_class.week(interval_start, 3) }
    it 'creates an array containing ' do
      expect(time_interval.collect_steps(step)).to eq(expected_steps)
    end
  end
end
