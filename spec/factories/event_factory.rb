FactoryGirl.define do
  factory :event do
    description "123"
    user "user"
    location "location"
    start_time Time.now
    end_time Time.now + 10.minutes
  end
end