FactoryGirl.define do
  factory :channel do
    sequence :channel_id do |n|
      "channel#{n}"
    end
    sequence :resource_id do |n|
      "calendar#{n}"
    end
    expiration Time.now
    association :conference_room
  end
end
