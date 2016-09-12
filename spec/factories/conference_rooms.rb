FactoryGirl.define do
  factory :conference_room do
    capacity 1
    sequence :email do |n|
      "email#{n}"
    end
    sequence :title do |n|
      "title#{n}"
    end
    sequence :color do |n|
      "##{n.to_s(16).rjust(6, '0')}"''
    end
    kind :narnia

    trait :with_channel do
      after(:create) do |conference_room|
        create(:channel, conference_room: conference_room)
      end
    end

    trait :with_expired_channel do
      after(:create) do |conference_room|
        create(:channel, :expired, conference_room: conference_room)
      end
    end
  end
end
