# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

day_time = Time.new(2016,6,11,8,0,0,"+02:00")
locations = ["Mordor", "Neverland", "Sherwood Forest", "Valhalla", "Voyager", "Winterfell", "Yellow Submarine"]

event_id = 1

4.times do |i|
  day_time += 1.days
  4.times do |j|
    start_time = day_time + j.hours * 3
    end_time = start_time + rand(1..2).hours + 30*(rand(0..1)).minutes
    Event.find_or_create_by(id: event_id) do |event|
      event.start_time = start_time
      event.end_time = end_time
      event.description = Faker::Company.catch_phrase
      event.location = locations.sample
      event.user = Faker::Name.name
      event_id += 1
    end
  end
end