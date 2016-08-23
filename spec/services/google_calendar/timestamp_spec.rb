require 'rails_helper'

describe GoogleCalendar::Timestamp do
  describe '.convert' do
    let(:time) { Time.now }
    let(:timestamp_string) { (time.to_i * 1000).to_s }

    subject(:timestamp) { described_class.convert(timestamp_string) }
    context 'with string timestamp in milliseconds' do
      it 'returns a timestamp in seconds' do
        expect(timestamp).to be_within(1.second).of(time)
      end
    end
  end
end
