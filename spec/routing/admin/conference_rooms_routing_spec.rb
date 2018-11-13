require 'rails_helper'

RSpec.describe Admin::ConferenceRoomsController, type: :routing do
  describe 'routing' do

    it 'routes to #index' do
      expect(:get => '/admin/conference_rooms').to route_to('admin/conference_rooms#index')
    end

    it 'routes to #new' do
      expect(:get => '/admin/conference_rooms/new').to route_to('admin/conference_rooms#new')
    end

    it 'routes to #edit' do
      expect(:get => '/admin/conference_rooms/1/edit').to route_to('admin/conference_rooms#edit', :id => '1')
    end

    it 'routes to #create' do
      expect(:post => '/admin/conference_rooms').to route_to('admin/conference_rooms#create')
    end

    it 'routes to #update via PUT' do
      expect(:put => '/admin/conference_rooms/1').to route_to('admin/conference_rooms#update', :id => '1')
    end

    it 'routes to #update via PATCH' do
      expect(:patch => '/admin/conference_rooms/1').to route_to('admin/conference_rooms#update', :id => '1')
    end

    it 'routes to #destroy' do
      expect(:delete => '/admin/conference_rooms/1').to route_to('admin/conference_rooms#destroy', :id => '1')
    end
  end
end
