class ConferenceRoom < ApplicationRecord
  HEX_COLOR_FORMAT = /\A#[0-9a-f]{3}([0-9a-f]{3})?\z/i
  KINDS = {
    narnia: 0,
    without_walls: 1,
    mordor: 2,
    small: 3,
    big: 4
  }.freeze

  enum kind: KINDS

  before_validation { color&.downcase! }
  validates :capacity, presence: true
  validates :color, presence: true, uniqueness: { case_sensitive: false }, format: HEX_COLOR_FORMAT
  validates :title, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
  has_one :channel, dependent: :destroy

  scope :without_channel, -> { left_outer_joins(:channel).where(channels: { id: nil }) }

  scope :with_expired_channel, -> { left_outer_joins(:channel).where(channels: { id: Channel.expired }) }

  scope :without_active_channel, -> { without_channel.or with_expired_channel }
end
