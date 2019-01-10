require 'rails_helper'

RSpec.describe 'Api::Devices', type: :request do
  let(:headers) { AuthHelper.device_auth }
  let(:valid_attributes) { { device_id: 'ABC', device_name: 'Device' } }
  let(:invalid_attributes) { { device_id: '', device_name: '' } }

  describe 'POST /api/conference_rooms' do
    subject { post api_devices_url, params: { device: attributes } }

    context 'with valid params' do
      let(:attributes) { valid_attributes }

      it 'creates a new Device' do
        expect { subject }.to change(Device, :count).by(1)
      end

      it_behaves_like 'successfull request'
    end

    context 'with invalid params' do
      let(:attributes) { invalid_attributes }

      it 'does not create a new Device' do
        expect { subject }.not_to change(Device, :count)
      end
    end
  end

  describe 'PUT /api/conference_rooms/1' do
    subject { put api_device_url(device), headers: headers, params: { device: attributes } }

    let!(:device) { create(:device, valid_attributes) }

    context 'with valid params' do
      let(:attributes) { { device_name: 'New Name' } }

      it 'updates a device' do
        expect do
          subject
          device.reload
        end.to change(device, :device_name).from('Device').to('New Name')
      end
    end

    context 'with invalid params' do
      let(:attributes) { { device_name: '' } }

      it 'does not update a device' do
        expect do
          subject
          device.reload
        end.not_to change(device, :device_name)
      end
    end
  end
end
