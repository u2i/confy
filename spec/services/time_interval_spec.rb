require 'rails_helper'

RSpec.describe TimeInterval do
  describe '.week' do
    let(:date) { Time.new(2016, 8, 2) }
    let(:week_start) { Time.new(2016, 8, 1) }
    let(:week_end) { Time.new(2016, 8, 5).end_of_day }

    subject(:time_interval) { described_class.week(date) }
    it 'creates an interval lasting exactly 5 days' do
      expect(time_interval.starting).to eq(week_start)
      expect(time_interval.ending).to eq(week_end)
    end
  end

  describe '.day' do
    let(:date) { Time.new(2016, 8, 2, 10) }
    let(:day_start) { date.at_beginning_of_day }
    let(:day_end) { date.at_end_of_day }

    subject(:time_interval) { described_class.day(date) }
    it 'creates an interval lasting 1 day' do
      expect(time_interval.starting).to eq(day_start)
      expect(time_interval.ending).to eq(day_end)
    end
  end

  describe '#collect_steps' do
    let(:interval_start) { Time.new(2016, 8, 1) }
    let(:step) { 1.day }

    let(:expected_steps) { [Time.new(2016, 8, 1), Time.new(2016, 8, 2), Time.new(2016, 8, 3)] }

    subject(:time_interval) { described_class.week(interval_start, 3) }
    it 'returns dates within interval spaced by step' do
      expect(time_interval.collect_steps(step)).to eq(expected_steps)
    end
  end

  describe '#to_rfc3339' do
    let(:starting) { Date.today.beginning_of_day }
    let(:starting_rfc3339) { starting.to_datetime.rfc3339(9) }
    let(:ending) { starting + 1.day }
    let(:ending_rfc3339) { ending.to_datetime.rfc3339(9) }
    it 'returns TimeIntervalRFC3339 instance' do
      expect(described_class.new(starting, ending).to_rfc3339).to be_a(TimeInterval::TimeIntervalRFC3339)
    end

    it 'returns TimeIntervalRFC3339 instance with valid fields' do
      instance = described_class.new(starting, ending).to_rfc3339
      expect(instance.starting).to eq(starting_rfc3339)
      expect(instance.ending).to eq(ending_rfc3339)
    end
  end
end
