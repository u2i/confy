class EventGrouper
  def self.group_into_blocks(events)
    events = events.order(:end_time)
    blocks = []

    current_block = []
    previous_event = events.first

    events.each do |event|
      unless event.start_time < previous_event.end_time
        blocks << current_block
        current_block = []
      end
      current_block << event
      current_block.sort_by!(&:start_time)
      previous_event = event
    end

    blocks << current_block unless current_block.empty?

    blocks
  end
end
