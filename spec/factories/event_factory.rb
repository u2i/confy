FactoryGirl.define do
  factory :event do
    description "123"
    user "user"
    start_time Time.now
    end_time Time.now + 10.minutes
    conference_room
  end
end