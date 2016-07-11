class Event < ApplicationRecord
  belongs_to :conference_room

  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :user, presence: true
  validates :conference_room, presence: true
  validate :start_time_must_be_lower_than_end_time
  validate :no_collision

  def start_time_must_be_lower_than_end_time
    return unless start_time && end_time
    errors.add(:start_time, 'Start time must be lower than end time')
  end

  def no_collision
    return unless start_time && end_time
    event = conference_room.events.in_span(start_time, end_time).first
    return unless event

    event_in_progress_text = "Another event already in progress in #{conference_room.title} "\
        "(#{event.start_time.strftime('%H:%M')} - #{event.end_time.strftime('%H:%M')})"

    if start_time < event.end_time && start_time >= event.start_time
      errors.add(:start_time, event_in_progress_text)
    end

    if end_time > event.start_time && end_time <= event.end_time
      errors.add(:end_time, event_in_progress_text)
    end
  end

  scope :in_span, -> (starting, ending) {
    where('? <= end_time AND ? >= start_time', starting, ending)
  }

  scope :in_week, ->(week) {
    in_span(week.beginning_of_week, week.end_of_week)
  }

  scope :in_week_group_by_weekday, -> (week) {
    in_week(week).group_by { |e| e.start_time.wday }
  }

end

