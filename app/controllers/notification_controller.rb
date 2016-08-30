class NotificationController < ApplicationController
  before_action :fetch_conference_room
  before_action :validate_request

  CHANNEL_ID_HEADER = 'X-Goog-Channel-ID'.freeze

  def receive
    NotifyClientsJob.perform_later params[:conference_room_id]
    head :ok
  end

  private

  def validate_request
    head :bad_request unless valid_request?
  end

  def valid_request?
    @conference_room.channel_id == channel_id
  end

  def fetch_conference_room
    @conference_room = ConferenceRoom.find(params[:conference_room_id].to_i)
  rescue ActiveRecord::RecordNotFound
    head :not_found
  end

  def channel_id
    request.headers[CHANNEL_ID_HEADER]
  end
end
