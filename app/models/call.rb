class Call < ApplicationRecord
  belongs_to :event

  validates_presence_of :link, :event_id
  validates_uniqueness_of :event_id
end
