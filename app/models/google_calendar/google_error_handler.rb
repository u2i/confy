module GoogleCalendar
  module GoogleErrorHandler
    GoogleAuthenticationError = Class.new(StandardError)

    def rescue_google_request
      yield if block_given?
    rescue ArgumentError => e
      raise GoogleAuthenticationError, e.message
    end
  end
end
