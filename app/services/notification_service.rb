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
    client.stop_channel(google_channel(channel))
  end

  private

  attr_accessor :conference_room, :channel, :client

  def subscribe
    new_google_channel = client.watch_event(channel.conference_room.email, google_channel(channel))
    channel.google_update!(new_google_channel)
  end

  def create_subscription
    channel = Channel.new(channel_id: SecureRandom.uuid, conference_room: conference_room)
    google_channel = client.watch_event(conference_room.email, google_channel(channel))
    channel.google_update!(google_channel)
  end

  def google_channel(channel)
    GoogleCalendar::ChannelFactory.build(channel)
  end
end

