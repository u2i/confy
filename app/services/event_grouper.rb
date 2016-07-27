class EventGrouper
  GRANULARITY = 30.minutes.freeze
  class << self
    def floor_time(time)
      if time > time.beginning_of_hour + GRANULARITY
        time.beginning_of_hour + GRANULARITY
      else
        time.beginning_of_hour
      end
    end

    def ceil_time(time)
      if time > time.beginning_of_hour + GRANULARITY
        time.beginning_of_hour + GRANULARITY + GRANULARITY
      elsif time > time.beginning_of_hour
        time.beginning_of_hour + GRANULARITY
      else
        time.beginning_of_hour
      end
    end
  end

  attr_reader :events

  def initialize(events)
    @events = events
  end

  def call
    build_blocks.map { |block| block.sort_by! { |n| n[:start][:date_time] } }
  end

  private

  def build_blocks
    @blocks = [[]]
    events.each do |event|
      if (block = find_block_for_event(event))
        block << event
        merge_blocks
      else
        add_new_block(event)
      end
    end

    @blocks
  end

  def find_block_for_event(event)
    @blocks.find do |block|
      event_in_block?(block, event)
    end
  end

  def event_in_block?(current_block, event)
    current_block.none? || event[:start][:date_time] < current_block.last[:end][:date_time]
  end

  def add_new_block(event)
    @blocks << [event]
  end

  def merge_blocks
    (0..(@blocks.size - 1)).to_a.combination(2).each do |y, x|
      next unless overlapping?(block_range(@blocks[y]), block_range(@blocks[x]))
      @blocks[x] += @blocks[y]
      @blocks.delete_at(y)
      return merge_blocks
    end
    false
  end

  def block_range(block)
    min = block.min_by { |v| v[:start][:date_time] }[:start][:date_time]
    max = block.max_by { |v| v[:end][:date_time] }[:end][:date_time]
    min..max
  end

  def overlapping?(left, right)
    left, right = right, left if left.min > right.min

    right.min < left.max
  end
end
