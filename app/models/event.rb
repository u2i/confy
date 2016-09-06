class Event < ApplicationRecord
  belongs_to :conference_room

  validates_presence_of :event_id, :conference_room_id
  validates_uniqueness_of :event_id

  def confirm
    new_record? ? self.confirmed = true : update(confirmed: true)
  end
end
