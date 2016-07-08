FactoryGirl.define do
  factory :event do
    name "name"
    description "123"
    user "user"
    start_time Time.now
    end_time Time.now + 10.minutes
    association :conference_room, factory: :conference_room
  end
end
