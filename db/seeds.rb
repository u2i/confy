{
  'Mordor' => ['u2i.com_2d3631343934393033313035@resource.calendar.google.com', '#CDE6F4', :mordor, 'mordor'],
  'Neverland' => ['u2i.com_3530363130383730383638@resource.calendar.google.com', '#D2D4F6', :small, 'neverland'],
  'Sherwood Forest' => ['u2i.com_2d33383335393438322d323331@resource.calendar.google.com', '#FFEBD3', :big, 'sherwood'],
  'Valhalla' => ['u2i.com_2d3836323435373930353536@resource.calendar.google.com', '#FFEEC0', :big, 'valhalla'],
  'Voyager' => ['u2i.com_2d39303636343933332d323732@resource.calendar.google.com', '#CDF8E7', :without_walls, 'voyager'],
  'Winterfell' => ['u2i.com_3331393831383634333035@resource.calendar.google.com', '#FFD7D3', :small, 'winterfell'],
  'Yellow Submarine' => ['u2i.com_3239383237392d373233@resource.calendar.google.com', '#FFDDDD', :without_walls, 'submarine'],
  'Narnia One' => ['u2i.com_32373936313132373036@resource.calendar.google.com', '#DFFABD', :narnia, 'n_one'],
  'Narnia Two' => ['u2i.com_36333333363436353339@resource.calendar.google.com', '#F8FEBF', :narnia, 'n_two']
}.map do |name, attrs|
  mail, color, kind, logo = attrs
  params = { capacity: rand(5..20), color: color, email: mail, kind: kind, logo: logo }
  ConferenceRoom.where(title: name).first_or_create!(params).tap { |cr| cr.update!(params) }
end
