class OccupiedRangeBuilder
  class << self
    def intersection_ranges(not_free, events)
      events.each_with_object([]) do |event, new_not_free|
        not_free.each do |range|
          if (intersected = intersection(range, event))
            new_not_free << intersected
          end
        end
      end
    end

    def occupied_ranges(rooms)
      not_free = []
      first_iteration = true
      rooms.each do |_room, events|
        if first_iteration
          events.each { |n| not_free << (n.start_time..n.end_time) }
          first_iteration = false
        elsif (not_free = intersection_ranges(not_free, events)).empty?
          break
        end
      end
      not_free
    end

    def occupied_slots_per_wday(reservations)
      occupied = {}
      empty_rooms = Hash[ConferenceRoom.all.map { |c| [c, []] }]
      reservations.each do |wday, events|
        reservations[wday] = empty_rooms.merge(events.group_by(&:conference_room))
      end
      reservations.each do |wday, rooms|
        occupied[wday] = occupied_ranges(rooms)
      end
      occupied
    end

    def intersection(left, right)
      return nil unless left && right
      return nil if left.max < right.begin || right.max < left.begin
      [left.begin, right.begin].max..[left.max, right.max].min
    end
  end
end
