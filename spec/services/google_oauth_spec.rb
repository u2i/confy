require 'rails_helper'

describe GoogleOauth do
  describe '.default_client' do
    it 'must return Signet::OAuth2::Client instance' do
      expect(GoogleOauth.default_client).to be_instance_of(Signet::OAuth2::Client)
    end
  end

  describe '.is_authenticated' do
    it 'should return false if not Hash is given' do
      param = []
      expect(GoogleOauth.is_authenticated?(param)).to eq false
    end

    it 'should return false if empty Hash is given' do
      param = {}
      expect(GoogleOauth.is_authenticated?(param)).to eq false
    end

    it 'should return false if Hash without client_id and client_secrets keys is given' do
      param = { 'irrelevant' => 123 }
      expect(GoogleOauth.is_authenticated?(param)).to eq false
    end

    it 'should return false if Hash without client_id is given' do
      param = { 'client_secret' => 123, 'irrelevant' => 'something' }
      expect(GoogleOauth.is_authenticated?(param)).to eq false
    end

    it 'should return false if Hash without client_secret is given' do
      param = { 'client_id' => 123, 'irrelevant' => 'something' }
      expect(GoogleOauth.is_authenticated?(param)).to eq false
    end

    it 'should return true if Hash with client_id and client_secret is given' do
      param = { 'client_secret' => 123, 'client_id' => 'something' }
      expect(GoogleOauth.is_authenticated?(param)).to eq true
    end

    it 'should return false if keys are symbols' do
      param = { client_secret: 123, client_id: 'something' }
      expect(GoogleOauth.is_authenticated?(param)).to eq false
    end
  end
end
