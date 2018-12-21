class NotifyCallsJob < ApplicationJob
  queue_as :default

  def perform(conference_room_id, link)
    ActionCable.server.broadcast('calls', conference_room_id: conference_room_id.to_i, link: link)
  end
end
