class Event < ApplicationRecord

  belongs_to :conference_room

  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :user, presence: true
  validates :conference_room, presence: true
  validate :start_time_must_be_lower_than_end_time
  validate :no_collision

  scope :in_span, -> (starting, ending) {
    where('? <= end_time AND ? >= start_time', starting, ending)
  }

  scope :in_week, ->(week) {
    in_span(week.beginning_of_week, week.end_of_week)
  }

  scope :in_week_group_by_weekday, -> (week) {
    in_week(week).group_by { |e| e.start_time.wday }
  }

  DEFAULT_COLOR = 'repeating-linear-gradient(-45deg,#D3E9FF,#D3E9FF 10px,#B8DCFF 10px,#B8DCFF 20px)'.freeze
  def self.not_free(week, css_color = DEFAULT_COLOR)
    occupied_slot = ConferenceRoom.new(color: css_color)
    Hash[(1..7).map { |n| [n, []] }]
        .merge(OccupiedRangeBuilder.occupied_slots_per_wday(order('start_time').in_week_group_by_weekday(week)))
        .tap do |wday_group|
      wday_group.each_value do |ranges|
        ranges.map! { |range| new(start_time: range.begin, end_time: range.end, conference_room: occupied_slot) }
      end
    end
  end

  def begin
    start_time
  end

  def max
    end_time
  end

  private

  def start_time_must_be_lower_than_end_time
    return unless start_time && end_time
    return unless start_time >= end_time
    errors.add(:start_time, 'Start time must be lower than end time')
  end

  def no_collision
    return unless start_time && end_time
    events = conference_room.events.in_span(start_time, end_time)
    return unless events.exists?

    event_in_progress_text = lambda do |event|
      "Another event already in progress in #{conference_room.title} "\
      "(#{event.start_time.strftime('%H:%M')} - #{event.end_time.strftime('%H:%M')})"
    end

    event = events.find { |e| start_time < e.end_time && start_time >= e.start_time }
    errors.add(:start_time, event_in_progress_text.call(event)) if event
    event = events.find { |e| end_time > e.start_time && end_time <= e.end_time }
    errors.add(:end_time, event_in_progress_text.call(event)) if event
  end
end
