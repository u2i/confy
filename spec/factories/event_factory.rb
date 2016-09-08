FactoryGirl.define do
  factory :event do
    sequence :event_id do |n|
      "event##{n}"
    end
    association :conference_room, factory: :conference_room
  end
end
