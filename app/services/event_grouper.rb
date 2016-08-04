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
    @events = events.sort_by { |event| event[:start][:date_time] }
  end

  def build_blocks
    blocks = []
    events.each do |event|
      block = blocks.find { |block| block.can_add_event(event) }
      block.nil? ? blocks.push(Block.new(event)) : block.add_event(event)
    end
    blocks.map { |block| block.block_events }
  end

  private

  class Block
    attr_reader :block_events
    def initialize(event=nil)
      @block_events = []
      @end_time = nil
      add_event(event) unless event.nil?
    end

    def add_event(event)
      if can_add_event(event)
        block_events.push(event)
        update_end_time(event)
      end
    end

    def can_add_event(event)
      @end_time.nil? || event[:start][:date_time] < @end_time
    end

    private

    def update_end_time(event)
      event_end_time = event[:end][:date_time]
      @end_time = event_end_time if should_update_end_time(event_end_time)
    end

    def should_update_end_time(new_end_time)
      @end_time.nil? || new_end_time > @end_time
    end
  end
end
