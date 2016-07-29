{
  'Mordor' => ['u2i.com_2d3631343934393033313035@resource.calendar.google.com', '#CDE6F4'],
  'Neverland' => ['u2i.com_3530363130383730383638@resource.calendar.google.com', '#D2D4F6'],
  'Sherwood Forest' => ['u2i.com_2d33383335393438322d323331@resource.calendar.google.com', '#FFEBD3'],
  'Valhalla' => ['u2i.com_2d3836323435373930353536@resource.calendar.google.com', '#FFEEC0'],
  'Voyager' => ['u2i.com_2d39303636343933332d323732@resource.calendar.google.com', '#CDF8E7'],
  'Winterfell' => ['u2i.com_3331393831383634333035@resource.calendar.google.com', '#FFD7D3'],
  'Yellow Submarine' => ['u2i.com_3239383237392d373233@resource.calendar.google.com', '#FFDDDD'],
  'Narnia One' => ['u2i.com_32373936313132373036@resource.calendar.google.com', '#DFFABD'],
  'Narnia Two' => ['u2i.com_36333333363436353339@resource.calendar.google.com', '#F8FEBF']
}.map do |name, mail_and_color|
  mail, color = mail_and_color
  params = { capacity: rand(5..20), color: color, email: mail }
  ConferenceRoom.where(title: name).first_or_create!(params).tap { |cr| cr.update!(params) }
end
