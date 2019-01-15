{
  'Mordor' => ['u2i.com_2d3631343934393033313035@resource.calendar.google.com', '#CDE6F4', :mordor, 'mordor'],
  'Sherwood Forest' => ['u2i.com_2d33383335393438322d323331@resource.calendar.google.com', '#FFEBD3', :big, 'sherwood'],
  'Valhalla' => ['u2i.com_2d3836323435373930353536@resource.calendar.google.com', '#FFEEC0', :big, 'valhalla']
}.map do |name, attrs|
  mail, color, kind, logo = attrs
  params = { capacity: rand(5..20), color: color, email: mail, kind: kind, logo: logo }
  ConferenceRoom.where(title: name).first_or_create!(params).tap { |cr| cr.update!(params) }
end
