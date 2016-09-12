require 'rails_helper'

RSpec.describe Channel, type: :model do
  include GoogleCalendar::Timestamp

  before { allow(GoogleOauth).to receive(:push_notification_client) }

  subject(:channel) { create :channel }
  describe 'factory' do
    it 'creates a valid channel' do
      expect(channel).to be_valid
    end
  end

  describe 'validation' do
    %i(channel_id resource_id expiration conference_room_id).each do |s|
      it { is_expected.to validate_presence_of s }
    end

    %i(channel_id resource_id conference_room_id).each do |s|
      it { is_expected.to validate_uniqueness_of s }
    end
  end

  describe 'destroy' do
    it 'removes subscription before deleting' do
      expect_any_instance_of(NotificationService).to receive(:unsubscribe)
      channel.destroy
    end
  end

  describe '.expired' do
    let!(:active_channel) { create(:channel) }
    let!(:expired_channel) { create(:channel, :expired) }

    let(:expected_channels) { [expired_channel] }

    subject(:channels) { described_class.expired }
    it 'returns expired channels' do
      expect(channels).to eq(expected_channels)
    end
  end

  describe '#google_update' do
    let(:resource_id) { 'ala' }
    let(:expiration) { '123456789' }
    let(:expiration_timestamp) { str_to_timestamp(expiration) }
    let(:conference_room) { create :conference_room }
    let(:google_channel) do
      channel = Google::Apis::CalendarV3::Channel.new
      channel.resource_id = resource_id
      channel.expiration = expiration.to_i.to_s
      channel
    end

    before { channel.google_update!(google_channel) }

    it 'updates channel expiration and resource id' do
      expect(channel.resource_id).to eq(resource_id)
      expect(channel.expiration).to eq(expiration_timestamp)
    end
  end
end
