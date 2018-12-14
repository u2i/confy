require 'rails_helper'

RSpec.describe Call, type: :model do
  it { is_expected.to validate_uniqueness_of :link }
  it { is_expected.to validate_presence_of :link }
  it { is_expected.to validate_presence_of :event_id }
end
