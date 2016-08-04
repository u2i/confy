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

    it 'must downcases color' do
      conference_room.valid? # Triggers before_validation
      expect(conference_room.color).to eq color.downcase
    end
  end

  describe '#as_json' do
    it 'casts type as integer' do
      room = build(:conference_room)
      [:narnia!, :without_walls!, :small!, :big!].each_with_index do |e, i|
        room.send(e)
        expect(room.as_json['kind'.freeze]).to eq i
      end
    end
  end
end
