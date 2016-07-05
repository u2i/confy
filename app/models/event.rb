class Event < ApplicationRecord
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :user, presence: true
  validates :location, presence: true
  validate :start_time_must_be_lower_than_end_time

  def start_time_must_be_lower_than_end_time
    errors.add(:start_time, "Can't be higher than end_time") if start_time.try(:>, end_time)
  end

end
