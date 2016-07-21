class EventGrouper
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
      found_block = false
      @blocks.each do |block|
         unless event_not_in_block?(block, event)
           block << event
           found_block = true
           break
         end
      end
      if found_block
        while merge_blocks
        end
      else
        @blocks << [event] unless found_block
      end
    end

    @blocks
  end

  def event_not_in_block?(current_block, event)
    current_block.any? && event[:start][:date_time] >= current_block.last[:end][:date_time]
  end

  def add_new_block
    @blocks << []
  end

  def merge_blocks
    size = @blocks.size
    0.upto(size - 1) do |y|
      (y + 1).upto(size - 1) do |x|
        range1 = block_range @blocks[y]
        range2 = block_range @blocks[x]
        if overlapping?(range1, range2)
          @blocks[x] += @blocks[y]
          @blocks.delete_at(y)
          return true
        end
      end
    end
    false
  end

  def block_range(block)
    min = block.min_by { |v| v[:start][:date_time] }[:start][:date_time]
    max = block.max_by { |v| v[:end][:date_time] }[:end][:date_time]
    [min, max]
  end

  def overlapping?(left, right)
    lower = left[0] < right[0] ? left : right
    upper = left[0] < right[0] ? right : left

    upper[0] < lower[1]
  end
end
