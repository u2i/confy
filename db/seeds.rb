# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

day_time = Time.now.beginning_of_week

conference_rooms = {
    "Mordor" => "u2i.com_2d3631343934393033313035@resource.calendar.google.com",
    "Neverland" => "u2i.com_3530363130383730383638@resource.calendar.google.com",
    "Sherwood Forest" => "u2i.com_2d33383335393438322d323331@resource.calendar.google.com",
    "Valhalla" => "u2i.com_2d3836323435373930353536@resource.calendar.google.com",
    "Voyager" => "u2i.com_2d39303636343933332d323732@resource.calendar.google.com",
    "Winterfell" => "u2i.com_3331393831383634333035@resource.calendar.google.com",
    "Yellow Submarine" => "u2i.com_3239383237392d373233@resource.calendar.google.com"
}.map do |name, email|
  params = { capacity: rand(5..20), color: "#%06x" % (rand * 0xffffff), email: email }
  ConferenceRoom.where(title: name).first_or_create(params).tap { |cr| cr.update(params) }
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
        conference_room: conference_rooms.sample,
        user: Faker::Name.name
    }
    Event.where(id: event_id).first_or_create(params).update(params)
    event_id += 1
  end
end