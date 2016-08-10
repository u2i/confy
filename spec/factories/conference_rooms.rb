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
  end
end
