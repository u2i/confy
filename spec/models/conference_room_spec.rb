require 'rails_helper'

RSpec.describe ConferenceRoom, type: :model do
  describe 'validation' do
    subject { build :conference_room }

    %i(title color capacity email).each do |s|
      it { is_expected.to validate_presence_of s }
    end

    it { is_expected.to validate_uniqueness_of(:color).case_insensitive }
    it { is_expected.to validate_uniqueness_of(:title) }
    it { is_expected.to validate_uniqueness_of(:email) }

    let(:valid_colors) { %w(#FfF000 #231482 #AbdD12 #E22 #123) }
    let(:invalid_colors) { %w(1023o 1230 12345 124fe #jugrju #123jku #9999999 #1234 #12 #A #b) }

    it 'ensures that color has the right format' do
      expect(valid_colors.all? { |n| subject.tap { |s| s.color = n }.valid? }).to be true
      expect(invalid_colors.none? { |n| subject.tap { |s| s.color = n }.valid? }).to be true
    end
  end

  describe 'before_validation' do
    let(:color) { '#fFB021' }
    let(:conference_room) { build :conference_room, color: color }

    it 'downcases color' do
      conference_room.valid? # Triggers before_validation
      expect(conference_room.color).to eq color.downcase
    end
  end

  describe 'scope' do
    let!(:conference_room) { create :conference_room }
    let!(:conference_room_with_channel) { create :conference_room }
    let!(:conference_room_with_expired_channel) { create :conference_room }
    let!(:channel) do
      create(:channel, conference_room: conference_room_with_channel, expiration: Time.now + 2 * Channel::SUBSCRIPTION_BUFFER)
    end
    let!(:expired_channel) do
      create(:channel, conference_room: conference_room_with_expired_channel, expiration: Time.now)
    end

    describe '.without_channel' do
      let(:expected_conference_rooms) { [conference_room] }

      subject(:conference_rooms) { described_class.without_channel.to_a }
      it 'returns conference rooms that do not have an assigned google notification channel' do
        expect(conference_rooms).to eq(expected_conference_rooms)
      end
    end

    describe '.with_expired_channel' do
      let(:expected_conference_rooms) { [conference_room_with_expired_channel] }

      subject(:conference_rooms) { described_class.with_expired_channel.to_a }
      it 'returns conference rooms that have an expired google notification channel' do
        expect(conference_rooms).to eq(expected_conference_rooms)
      end
    end

    describe '.without_active_channel' do
      let(:expected_conference_rooms) { [conference_room, conference_room_with_expired_channel] }

      subject(:conference_rooms) { described_class.without_active_channel.to_a }
      it 'returns conference rooms that have no channel or an expired channel' do
        expect(conference_rooms).to match_array(expected_conference_rooms)
      end
    end
  end
end
