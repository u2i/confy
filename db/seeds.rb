{
  'Mordor' => ['u2i.com_2d3631343934393033313035@resource.calendar.google.com', '#CDE6F4', :small],
  'Neverland' => ['u2i.com_3530363130383730383638@resource.calendar.google.com', '#D2D4F6', :small],
  'Sherwood Forest' => ['u2i.com_2d33383335393438322d323331@resource.calendar.google.com', '#FFEBD3', :big],
  'Valhalla' => ['u2i.com_2d3836323435373930353536@resource.calendar.google.com', '#FFEEC0', :big],
  'Voyager' => ['u2i.com_2d39303636343933332d323732@resource.calendar.google.com', '#CDF8E7', :without_walls],
  'Winterfell' => ['u2i.com_3331393831383634333035@resource.calendar.google.com', '#FFD7D3', :small],
  'Yellow Submarine' => ['u2i.com_3239383237392d373233@resource.calendar.google.com', '#FFDDDD', :without_walls],
  'Narnia One' => ['u2i.com_32373936313132373036@resource.calendar.google.com', '#DFFABD', :narnia],
  'Narnia Two' => ['u2i.com_36333333363436353339@resource.calendar.google.com', '#F8FEBF', :narnia]
}.map do |name, attrs|
  mail, color, kind = attrs
  params = { capacity: rand(5..20), color: color, email: mail, kind: kind }
  ConferenceRoom.where(title: name).first_or_create!(params).tap { |cr| cr.update!(params) }
end
