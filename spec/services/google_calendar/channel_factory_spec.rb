require 'rails_helper'

RSpec.describe GoogleCalendar::ChannelFactory do
  let!(:conference_room) { create :conference_room }
  let(:host) { 'http://example.com' }
  let(:url) { described_class.channel_address(conference_room.id) }

  before { ENV['NOTIFICATION_HOST'] = host }

  describe '#channel_address' do
    context 'with conference room id' do
      it 'builds appropriate google push notification url' do
        expect(url).to eq("#{host}/notify/#{conference_room.id}")
      end
    end
  end

  describe '#build' do
    let(:resource_id) { 'abc' }
    let(:channel) { build(:channel, conference_room: conference_room, resource_id: resource_id) }

    subject(:google_channel) { described_class.build(channel) }
    it 'creates a valid google channel' do
      expect(google_channel.id).to eq(channel.channel_id)
      expect(google_channel.resource_id).to eq(channel.resource_id)
      expect(google_channel.type).to eq('web_hook')
      expect(url).to eq("#{host}/notify/#{conference_room.id}")
    end
  end
end
