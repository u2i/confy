class Event < ApplicationRecord
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :user, presence: true
  validates :location, presence: true
  validate :start_time_must_be_lower_than_end_time

  def start_time_must_be_lower_than_end_time
    errors.add(:start_time, "Can't be higher than end_time") if start_time.try(:>, end_time)
  end

  scope :in_week, ->(week) {
    query = '(start_time >= :start_week AND start_time <= :end_week)'\
    'OR (end_time >= :start_week AND end_time <= :end_week )'\
    'OR (start_time <= :start_week AND end_time >= :end_week)'
    where(query, start_week: week.beginning_of_week, end_week: week.end_of_week)
  }

  scope :in_week_group_by_weekday, -> (week) {
    in_week(week).group_by { |e| e.start_time.wday }
  }

end
