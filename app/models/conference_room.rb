class ConferenceRoom < ApplicationRecord
  before_validation { self.color&.downcase! }

  validates :capacity, presence: true
  #validates that color format is like: #FF0ddE
  validates :color, presence: true, uniqueness: { case_sensitive: false }, format: %r{\A#[0-9a-f]{3}([0-9a-f]{3})?\z}i
  validates :title, presence: true, uniqueness: true

  has_many :events, dependent: :destroy

end
