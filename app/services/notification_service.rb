class NotificationService
  def initialize(conference_room)
    @client = GoogleOauth.push_notification_client
    @conference_room = conference_room
    @channel = conference_room.channel
  end

  def renew_subscription
    return create_subscription if channel.nil?
    unsubscribe
    subscribe
  end

  def unsubscribe
    client.stop_channel(google_channel)
  end

  private

  attr_accessor :conference_room, :channel, :client

  def create_subscription
    create_new_channel
    subscribe
  end

  def subscribe
    new_google_channel = google_subscription_channel
    channel.google_update!(new_google_channel)
  end

  def create_new_channel
    @channel = Channel.new(channel_id: SecureRandom.uuid, conference_room: conference_room)
  end

  def google_subscription_channel
    client.watch_event(conference_room.email, google_channel)
  end

  def google_channel
    GoogleCalendar::ChannelFactory.build(channel)
  end
end
