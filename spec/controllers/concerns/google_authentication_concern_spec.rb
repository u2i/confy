require 'rails_helper'

RSpec.describe ApplicationController, type: :controller do
  controller do
    include GoogleAuthentication

    def index
      render json: 'fake controller'
    end
  end
  describe 'before each action' do
    it 'checks authentication' do
      allow(controller).to receive(:check_authentication) { true }
      get :index
      expect(controller).to have_received :check_authentication
    end

    it 'refreshes token' do
      allow(controller).to receive(:check_authentication) { true }
      allow(controller).to receive(:refresh_token) { true }
      get :index
      expect(controller).to have_received :refresh_token
    end
  end

  describe '.refresh token' do
    context 'user credentials are present in session' do
      let(:credentials) { {credentials: 'custom_credentials'} }
      it 'invokes GoogleOauth refresh_token method and obtains new credentials' do
        allow(controller).to receive(:check_authentication) { true }
        allow(controller).to receive(:session) { credentials }
        allow(GoogleOauth).to receive(:refresh_token) {}
        get :index
        expect(GoogleOauth).to have_received(:refresh_token)
      end
    end

    context 'user credentials are not present in session' do
      let(:credentials) { {} }
      it 'does not invoke GoogleOauth refresh_token method' do
        allow(controller).to receive(:check_authentication) { true }
        allow(controller).to receive(:session) { credentials }
        allow(GoogleOauth).to receive(:refresh_token) {}
        get :index
        expect(GoogleOauth).not_to have_received(:refresh_token)
      end
    end
  end

  describe '.check_authentication' do
    context 'user credentials are not present in session' do
      let(:credentials) { {} }
      it 'redirects to authentication' do
        allow(controller).to receive(:session) { credentials }
        get :index
        expect(response).to redirect_to oauth2callback_path
      end
    end

    context 'user credentials are present in session' do
      let(:credentials) { {credentials: {custom_credentials: true}.to_json} }
      context 'user is not authenticated' do
        it 'redirects to authentication' do
          allow(controller).to receive(:session) { credentials }
          allow(GoogleOauth).to receive(:authenticated?) { false }
          get :index
          expect(response).to redirect_to oauth2callback_path
        end
      end
      context 'user is authenticated' do
        it 'doest not redirect to authentication' do
          allow(controller).to receive(:session) { credentials }
          allow(GoogleOauth).to receive(:authenticated?) { true }
          get :index
          expect(response).not_to redirect_to oauth2callback_path
        end
      end
    end
  end
end
