class NotifyClientsJob < ApplicationJob
  queue_as :default

  def perform(*args)
    conference_room_id = args[0]
    ActionCable.server.broadcast('events', conference_room_id: conference_room_id.to_i)
  end
end
