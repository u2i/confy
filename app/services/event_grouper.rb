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
      add_new_block if event_not_in_block?(@blocks.last, event)
      @blocks.last << event
    end

    @blocks
  end

  def event_not_in_block?(current_block, event)
    current_block.any? && event[:start][:date_time] >= current_block.last[:end][:date_time]
  end

  def add_new_block
    @blocks << []
  end
end
