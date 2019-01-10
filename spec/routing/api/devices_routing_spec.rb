require 'rails_helper'

RSpec.describe Api::DevicesController, type: :routing do
  describe 'routing' do
    it 'routes to #create' do
      expect(post: '/api/devices').to route_to('api/devices#create', format: :json)
    end

    it 'routes to #update via PUT' do
      expect(put: '/api/devices/1').to route_to('api/devices#update', id: '1', format: :json)
    end

    it 'routes to #update via PATCH' do
      expect(patch: '/api/devices/1').to route_to('api/devices#update', id: '1', format: :json)
    end

    it 'routes to #destroy' do
      expect(delete: '/api/devices/1').to route_to('api/devices#destroy', id: '1', format: :json)
    end
  end
end
