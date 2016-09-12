namespace :google do
  desc 'Register for push notifications'
  task :push_register => :environment do
    ConferenceRoom.without_active_channel.each do |conference_room|
      p "Creating channel for conference room #{conference_room.title}"
      NotificationService.new(conference_room).renew_subscription
    end
  end

  desc 'Unsubscribe from push notifications'
  task :push_unsub => :environment do
    p 'Deleting all channels'
    Channel.destroy_all
  end

  desc 'Recreate all subscriptions'
  task :push_refresh => [:environment, :push_unsub, :push_register]
end
