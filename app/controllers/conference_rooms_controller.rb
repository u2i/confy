class ConferenceRoomsController < ApplicationController
  include GoogleAuthentication
  include GoogleEventClient

  before_action :refresh_token
  before_action :check_authentication

  def show
    create_props
  end

  private

  def create_props
    @props = {conference_room: conference_room}.compact
  end

  def conference_room
    @conference_room ||= ConferenceRoom.find_by!(title: params[:title].titleize)
  end
end
