module Admin
  class ConferenceRoomsController < ApplicationController
    before_action :set_admin_conference_room, only: [:edit, :update, :destroy]

    def index
      @rooms = ::ConferenceRoom.all
    end

    def new
      @room = ::ConferenceRoom.new
    end

    def edit
    end

    def create
      @room = ::ConferenceRoom.new(conference_room_params)

      if @room.save
        redirect_to admin_conference_rooms_url, notice: 'Conference room was successfully created.'
      else
        render :new
      end
    end

    def update
      if @room.update(conference_room_params)
        redirect_to admin_conference_rooms_url, notice: 'Conference room was successfully updated.'
      else
        render :edit
      end
    end

    def destroy
      @room.destroy
      redirect_to admin_conference_rooms_url, notice: 'Conference room was successfully destroyed.'
    end

    private

    def set_admin_conference_room
      @room = ::ConferenceRoom.find(params[:id])
    end

    def conference_room_params
      params.require(:conference_room).permit(:capacity, :color, :title, :email)
    end
  end
end
