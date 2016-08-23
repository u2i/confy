module GoogleCalendar
  class ChannelFactory
    TYPE = 'web_hook'.freeze

    def self.build(channel)
      google_channel = Google::Apis::CalendarV3::Channel.new
      google_channel.id = channel.channel_id
      google_channel.resource_id = channel.resource_id
      google_channel.type = TYPE
      google_channel.address = channel_address(channel.conference_room_id)
      google_channel
    end

    def self.channel_address(conference_room_id)
      Rails.application.routes.url_helpers.notifications_url(conference_room_id, host: ENV.fetch('NOTIFICATION_HOST'))
    end
  end
end
