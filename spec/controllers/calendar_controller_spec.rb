require 'rails_helper'

RSpec.describe CalendarController, type: :controller do
  describe "GET index" do
    render_views

    it "renders" do
      get :index
      expect(response).to be_ok
      expect(response.body).to include 'Confy'
    end
  end
end
