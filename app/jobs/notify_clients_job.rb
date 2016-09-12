class NotifyClientsJob < ApplicationJob
  queue_as :default

  def perform(conference_room_id)
    ActionCable.server.broadcast('events', conference_room_id: conference_room_id.to_i)
  end
end
