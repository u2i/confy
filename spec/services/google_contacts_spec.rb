require 'rails_helper'

RSpec.describe GoogleContacts do
  describe '#call' do
    let(:service) { double('service', list_users: []) }

    it 'sends request' do
      expect(service).to receive(:list_users).with(
        customer: GoogleContacts::CUSTOMER,
        view_type: GoogleContacts::VIEW_TYPE,
        max_results: GoogleContacts::MAX_USER_COUNT,
        fields: GoogleContacts::DEFAULT_FIELDS
      )
      described_class.new(:credentials, service).call
    end

    context 'Google Error' do
      it 'returns nil' do
        allow(service).to receive(:list_users) { raise Google::Apis::ServerError, 'Error'.freeze }
        expect(described_class.new(:credentials, service).call).to be_nil
      end
    end
  end
end
