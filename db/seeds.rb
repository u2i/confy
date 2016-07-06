# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

day_time = Time.new(2016,7,11,8,0,0,"+02:00")
locations = ["Mordor", "Neverland", "Sherwood Forest", "Valhalla", "Voyager", "Winterfell", "Yellow Submarine"].map do |n|
  params = { title: n, capacity: rand(5.20), color: "#%06x" % (rand * 0xffffff) }
  if (c = ConferenceRoom.find_by_title(n))
    c.update_attributes!(**params)
    c
  else
    ConferenceRoom.create!(**params)
  end
end

event_id = 1

4.times do |i|
  day_time += 1.days
  4.times do |j|
    start_time = day_time + j.hours * 3
    end_time = start_time + rand(1..2).hours + 30*(rand(0..1)).minutes
    params = {
        start_time: start_time,
        end_time: end_time,
        description: Faker::Company.catch_phrase,
        conference_room: locations.sample,
        user: Faker::Name.name
    }
    if (e = Event.find_by_id(event_id))
      e.update_attributes!(**params)
    else
      Event.create!(**params)
    end
    event_id += 1
  end
end