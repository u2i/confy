require 'rails_helper'

RSpec.describe Device, type: :model do
  it { is_expected.to validate_uniqueness_of :device_id }
  it { is_expected.to validate_presence_of :device_id }
  it { is_expected.to validate_presence_of :device_name }
end
