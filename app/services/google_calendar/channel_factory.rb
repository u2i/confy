module GoogleCalendar
  class ChannelFactory
    TYPE = 'web_hook'.freeze

    def self.build(channel)
      Google::Apis::CalendarV3::Channel.new.tap do |google_channel|
        google_channel.id = channel.channel_id
        google_channel.resource_id = channel.resource_id
        google_channel.type = TYPE
        google_channel.address = channel_address(channel.conference_room_id)
      end
    end

    def self.channel_address(conference_room_id)
      Rails.application.routes.url_helpers.notifications_url(conference_room_id, host: ENV.fetch('NOTIFICATION_HOST'))
    end
  end
end
