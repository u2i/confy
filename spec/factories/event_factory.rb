FactoryGirl.define do
  factory :event do
    sequence :name do |n|
      "event##{n}'s name"
    end
    description "123"
    user "user"
    start_time Time.new(2016, 01, 01)
    end_time Time.new(2016, 01, 01) + 10.minutes
    association :conference_room, factory: :conference_room
  end
end
