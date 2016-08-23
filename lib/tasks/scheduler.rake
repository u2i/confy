desc 'Register for Google Calendar push notifications'
task :google_push_register => :environment do
  ConferenceRoom.without_active_channel.each do |conference_room|
    NotificationService.new(conference_room).renew_subscription
  end
end
