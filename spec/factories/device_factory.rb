FactoryGirl.define do
  factory :device do
    sequence :device_id do |n|
      "device_#{n}"
    end
    sequence :device_name do |n|
      "device_name_#{n}"
    end
    authorized false
    association :conference_room, factory: :conference_room
  end
end
