class ConferenceRoom < ApplicationRecord

  HEX_COLOR_FORMAT = %r{\A#[0-9a-f]{3}([0-9a-f]{3})?\z}i

  before_validation { color&.downcase! }
  validates :capacity, presence: true
  validates :color, presence: true, uniqueness: { case_sensitive: false }, format: HEX_COLOR_FORMAT
  validates :title, presence: true, uniqueness: true
  has_many :events, dependent: :destroy

end
