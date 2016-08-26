require 'rails_helper'

describe GoogleCalendar::Timestamp do
  let(:extended_class) { Class.new { extend GoogleCalendar::Timestamp } }

  describe '.convert' do
    let(:time) { Time.now }
    let(:timestamp_string) { (time.to_i * 1000).to_s }

    subject(:timestamp) { extended_class.str_to_timestamp(timestamp_string) }
    context 'with string timestamp in milliseconds' do
      it 'returns a timestamp in seconds' do
        expect(timestamp).to be_within(1.second).of(time)
      end
    end
  end
end
