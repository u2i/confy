require 'rails_helper'

RSpec.describe Api::ConferenceRoomsController, type: :routing do
  describe 'routing' do
    it 'routes to #index' do
      expect(get: '/api/conference_rooms').to route_to('api/conference_rooms#index', format: :json)
    end
  end
end
