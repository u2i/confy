{
  'Mordor' => ['u2i.com_2d3631343934393033313035@resource.calendar.google.com', '#CDE6F4', :mordor, 'mordor', 7],
  'Sherwood Forest' => ['u2i.com_2d33383335393438322d323331@resource.calendar.google.com', '#FFEBD3', :big, 'sherwood', 11],
  'Valhalla' => ['u2i.com_2d3836323435373930353536@resource.calendar.google.com', '#FFEEC0', :big, 'valhalla', 9],
  'Number 7' => ['u2i.com_3930303738353235363435@resource.calendar.google.com', '#666', :small, 'mordor', 6],
  'Number 4' => ['u2i.com_3138383638383033323934@resource.calendar.google.com', '#bbb', :small, 'mordor', 2],
  'Sauna - No. 1' => ['u2i.com_3939313637383237363833@resource.calendar.google.com', '#eee', :small, 'mordor', 2],
  'Aquarium - No. 6' => ['u2i.com_3132383233303831353731@resource.calendar.google.com', '#999', :big, 'mordor', 7],
  'Krzywa Podłoga - No. 9' => ['u2i.com_3638303738343439323138@resource.calendar.google.com', '#888', :small, 'mordor', 4],
  'Number 2' => ['u2i.com_3730343333333436393339@resource.calendar.google.com', '#ddd', :small, 'mordor', 2],
  'Pociong - No. 3' => ['u2i.com_3131363237353534363636@resource.calendar.google.com', '#ccc', :small, 'mordor', 4],
  'Krzywy Stół - No. 5' => ['u2i.com_3733343735323532363930@resource.calendar.google.com', '#aaa', :big, 'mordor', 16],
  'Brak Okien - No. 8' => ['u2i.com_3136313132353832313433@resource.calendar.google.com', '#777', :small, 'mordor', 4]
}.map do |name, attrs|
  mail, color, kind, logo, capacity = attrs
  params = { capacity: capacity, color: color, email: mail, kind: kind, logo: logo }
  ConferenceRoom.where(title: name).first_or_create!(params).tap { |cr| cr.update!(params) }
end
