class Channel < ApplicationRecord
  include GoogleCalendar::Timestamp

  SUBSCRIPTION_BUFFER = 2.days

  belongs_to :conference_room
  validates_presence_of :channel_id, :resource_id, :expiration, :conference_room_id
  validates_uniqueness_of :channel_id, :resource_id, :conference_room_id

  before_destroy :unsubscribe

  scope :expired, -> { where('expiration <= ?', Time.now + SUBSCRIPTION_BUFFER) }

  def google_update!(google_channel)
    update!(resource_id: google_channel.resource_id,
            expiration: str_to_timestamp(google_channel.expiration))
  end

  private

  def unsubscribe
    NotificationService.new(conference_room).unsubscribe
  end
end
