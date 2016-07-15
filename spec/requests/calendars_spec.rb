require 'rails_helper'

RSpec.describe 'Calendars', type: :request do
  describe 'GET /calendars' do
    it 'works! (now write some real specs)' do
      get root_path # CalendarController#index
      expect(response).to have_http_status(302)
    end
  end
end
