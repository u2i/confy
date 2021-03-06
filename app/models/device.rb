class Device < ApplicationRecord
  belongs_to :conference_room

  validates_presence_of :device_id, :device_name
  validates_uniqueness_of :device_id

  scope :authorized, -> { where(authorized: true) }
  scope :sorted, -> { order(updated_at: :desc) }
end
