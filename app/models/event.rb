class Event < ApplicationRecord
  belongs_to :conference_room

  validates_presence_of :event_id, :conference_room_id
  validates_uniqueness_of :event_id

  def confirm
    update(confirmed: true)
  end

  def self.confirm_or_create(conference_room, event_id)
    event = find_or_create_by(conference_room: conference_room, event_id: event_id)
    event.confirm
  end

  scope :confirmed, -> { where(confirmed: true) }

  def self.confirmed_event_ids
    confirmed.pluck(:event_id)
  end

  def self.google_event_confirmed?(event)
    confirmed.where(event_id: event.id).any?
  end
end
