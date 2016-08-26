require 'rails_helper'

RSpec::Matchers.define :matching_google_channel do |expected|
  match do |actual|
    actual.resource_id == expected.resource_id && actual.id == expected.channel_id
  end
end

RSpec::Matchers.define :valid_notification_request do |conference_room|
  match do |actual|
    actual.address == GoogleCalendar::ChannelFactory.channel_address(conference_room.id) &&
      actual.type == 'web_hook' &&
      actual.id.present?
  end
end

RSpec.describe NotificationService do
  include GoogleCalendar::Timestamp

  let(:google_channel) { double('channel', resource_id: 'elo', expiration: '123456') }
  let(:client) { double('client', watch_event: google_channel, stop_channel: false) }

  before do
    allow(GoogleOauth).to receive(:push_notification_client) { client }
  end

  describe '#renew_subscription' do
    let(:conference_room) { create :conference_room }
    let(:notification_service) { described_class.new(conference_room) }

    subject(:channel) { Channel.first }
    context 'when channel does not exist' do
      before { notification_service.renew_subscription }

      it 'creates a new subscription' do
        expect(channel.resource_id).to eq(google_channel.resource_id)
        expect(channel.conference_room).to eq(conference_room)
      end
    end

    context 'when subscription expired' do
      let(:channel) { build :channel }
      let(:conference_room) { channel.conference_room }

      it 'calls stop_channel and watch_event on google client' do
        expect(client).to receive(:stop_channel).with(matching_google_channel(channel))
        expect(client).to receive(:watch_event).with(conference_room.email, valid_notification_request(conference_room))
        notification_service.renew_subscription
      end

      it 'updates channel expiration time' do
        notification_service.renew_subscription
        expect(channel.expiration).to eq(str_to_timestamp(google_channel.expiration))
      end
    end
  end
end
