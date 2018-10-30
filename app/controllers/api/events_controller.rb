module Api
  class EventsController < ApplicationController
    include GoogleEventClient

    def index
      events = service_account_client.all(span_param.to_rfc3339)
      render json: events
    end
  end
end
