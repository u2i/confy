require 'rails_helper'

RSpec.describe EventsHelper, type: :helper do
  describe '.next_week' do
    let(:custom_day) { Date.today - 24.days }
    let(:custom_day_s) { custom_day.to_s }

    context 'nil given' do
      it 'returns day from the following week' do
        expect(helper.next_week(nil)).to eq(Date.today.next_week)
      end
    end

    context 'date given in string format' do
      it 'returns date 7 days after given day' do
        expect(helper.next_week(custom_day_s)).to eq(custom_day.next_week)
      end
    end

    context 'no string given' do
      it 'returns day from the following week' do
        expect(helper.next_week(custom_day)).to eq(custom_day.next_week)
      end
    end
  end

  describe '.previous_week' do
    let(:custom_day) { Date.today - 24.days }
    let(:custom_day_s) { custom_day.to_s }

    context 'nil given' do
      it 'returns day from the previous week' do
        expect(helper.previous_week(nil)).to eq(Date.today.prev_week)
      end
    end

    context 'date given in string format' do
      it 'returns date 7 days before given day' do
        expect(helper.previous_week(custom_day_s)).to eq(custom_day.prev_week)
      end
    end

    context 'no string given' do
      it 'returns day from the previous week' do
        expect(helper.previous_week(custom_day)).to eq(custom_day.prev_week)
      end
    end
  end
end
