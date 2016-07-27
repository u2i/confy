require 'rails_helper'

RSpec.describe 'Authentications', type: :request do
  describe 'GET /oauth2callback' do
    context 'valid credentials' do
      let(:google_credentials) { 'sample string' }
      let(:sample_email) { 'example@com' }

      before do
        allow(GoogleOauth).to receive(:get_user_credentials) { google_credentials }
        allow(GoogleOauth).to receive(:user_email) { sample_email }
        get oauth2callback_path, params: {code: 'sample_code'}
      end

      it 'redirects to root_path and sets session' do
        expect(response).to redirect_to root_path
      end
    end

    context 'invalid credentials' do
      let(:example_page) { 'http://example.com' }
      before do
        allow(GoogleOauth).to receive(:get_user_credentials) { raise ArgumentError, 'Test error' }
        allow(GoogleOauth).to receive(:request_code_uri) { example_page }
        get oauth2callback_path, params: {code: 'sample_code'}
      end

      it 'redirects to root_path and sets session' do
        expect(response).to redirect_to example_page
      end
    end
  end
end
