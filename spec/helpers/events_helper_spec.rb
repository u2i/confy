require 'rails_helper'

# Specs in this file have access to a helper object that includes
# the EventsHelper. For example:
#
# describe EventsHelper do
#   describe "string concat" do
#     it "concats two strings with spaces" do
#       expect(helper.concat_strings("this","that")).to eq("this that")
#     end
#   end
# end
RSpec.describe EventsHelper, type: :helper do
  describe '.next_week' do
    let(:custom_day) {
      Date.today - 24.days
    }
    let(:custom_day_s) {
      custom_day.to_s
    }
    context 'nil given' do
      it 'returns day from the following week' do
        expect(helper.next_week(nil)).to eq(Date.today + 7.days)
      end
    end

    context 'date given in string format' do
      it 'returns date 7 days after given day' do
        expect(helper.next_week(custom_day_s)).to eq(custom_day + 7.days)
      end
    end

    context 'no string given' do
      it 'returns day from the following week' do
        expect(helper.next_week(custom_day)).to eq(Date.today + 7.days)
      end
    end
  end

  describe '.previous_week' do
    let(:custom_day) {
      Date.today - 24.days
    }
    let(:custom_day_s) {
      custom_day.to_s
    }
    context 'nil given' do
      it 'returns day from the previous week' do
        expect(helper.previous_week(nil)).to eq(Date.today - 7.days)
      end
    end

    context 'date given in string format' do
      it 'returns date 7 days before given day' do
        expect(helper.previous_week(custom_day_s)).to eq(custom_day - 7.days)
      end
    end

    context 'no string given' do
      it 'returns day from the previous week' do
        expect(helper.previous_week(custom_day)).to eq(Date.today - 7.days)
      end
    end
  end
end
