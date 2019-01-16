{
  'Mordor' => ['u2i.com_2d3631343934393033313035@resource.calendar.google.com', '#CDE6F4', :mordor, 'mordor', 7],
  'Sherwood Forest' => ['u2i.com_2d33383335393438322d323331@resource.calendar.google.com', '#FFEBD3', :big, 'sherwood', 11],
  'Valhalla' => ['u2i.com_2d3836323435373930353536@resource.calendar.google.com', '#FFEEC0', :big, 'valhalla', 9],
  '1. Sauna' => ['u2i.com_3939313637383237363833@resource.calendar.google.com', '#eaa', :small, 'mordor', 2],
  '2. Number 2' => ['u2i.com_3730343333333436393339@resource.calendar.google.com', '#eab', :small, 'mordor', 2],
  '3. Pociong' => ['u2i.com_3131363237353534363636@resource.calendar.google.com', '#eac', :small, 'mordor', 4],
  '4. Number 4' => ['u2i.com_3138383638383033323934@resource.calendar.google.com', '#ead', :small, 'mordor', 2],
  '5. Krzywy Stół' => ['u2i.com_3733343735323532363930@resource.calendar.google.com', '#aea', :big, 'mordor', 16],
  '6. Aquarium' => ['u2i.com_3132383233303831353731@resource.calendar.google.com', '#aeb', :big, 'mordor', 7],
  '7. Number 7' => ['u2i.com_3930303738353235363435@resource.calendar.google.com', '#eea', :small, 'mordor', 6],
  '8. Brak Okien' => ['u2i.com_3136313132353832313433@resource.calendar.google.com', '#eeb', :small, 'mordor', 4],
  '9. Krzywa Podłoga' => ['u2i.com_3638303738343439323138@resource.calendar.google.com', '#eec', :small, 'mordor', 4]
}.map do |name, attrs|
  mail, color, kind, logo, capacity = attrs
  params = { capacity: capacity, color: color, email: mail, kind: kind, logo: logo }
  ConferenceRoom.where(title: name).first_or_create!(params).tap { |cr| cr.update!(params) }
end
