module Api
  class ConferenceRoomsController < ApplicationController
    def index
      render json: ConferenceRoom.all.to_json(except: [:email, :kind, :logo, :created_at, :updated_at])
    end
  end
end
