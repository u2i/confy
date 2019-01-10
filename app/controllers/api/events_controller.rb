module Api
  class EventsController < Api::ApplicationController
    include GoogleEventClient

    def index
      events = service_account_client.all(span_param.to_rfc3339, with_confirmation?)
      render json: events
    end

    def create
      event_params = create_event_params
      data = service_account_client.create(event_params.to_h).to_h

      data[:confirmed] = Event.confirm_or_create(conference_room, data[:id]) if event_params[:confirmed].present?
      data[:conference_room] = conference_room

      render json: data, status: :created
    end

    def finish
      service_account_client.finish(conference_room, params[:event_id])
      head :ok
    end

    def confirm
      Event.confirm_or_create(conference_room, params[:event_id])
      head :ok
    end

    def update
      event = service_account_client.update(conference_room, params[:event_id], edit_event_params)
      confirmed = Event.google_event_confirmed?(event)
      render json: event.to_h.merge(confirmed: confirmed)
    end

    private

    def conference_room
      @conference_room ||= ConferenceRoom.find(params[:conference_room_id])
    end

    def confirmed_ids
      @confirmed_ids ||= Event.confirmed_event_ids
    end

    def create_event_params
      params.require(:event).permit(:summary, :conference_room_id, :start_time, :end_time, :confirmed)
    end

    def edit_event_params
      params.require(:event).permit(:summary, :start_time, :end_time)
    end
  end
end
