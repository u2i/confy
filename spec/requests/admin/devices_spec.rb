require 'rails_helper'

RSpec.describe 'Admin::Devices', type: :request do
  let(:headers) { AuthHelper.http_basic_auth }
  let(:valid_attributes) { { device_id: 'ABC', device_name: 'Device' } }
  let(:invalid_attributes) { { device_id: '', device_name: '' } }

  describe 'GET /admin/devices' do
    subject { get admin_devices_path, headers: headers }

    it_behaves_like 'successfull request'
    it_behaves_like 'unauthenticated request'
  end

  describe 'GET /admin/devices/1/edit' do
    subject { get edit_admin_devices_url(device), headers: headers }

    let!(:device) { create(:device, valid_attributes) }

    it_behaves_like 'successfull request'
    it_behaves_like 'unauthenticated request'
  end
end
