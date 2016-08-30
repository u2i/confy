FactoryGirl.define do
  factory :channel do
    sequence :channel_id do |n|
      "channel#{n}"
    end
    sequence :resource_id do |n|
      "calendar#{n}"
    end
    expiration Time.now + 1.year
    association :conference_room

    trait :expired do
      expiration Time.now
    end
  end
end
