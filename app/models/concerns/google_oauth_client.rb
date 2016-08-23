module GoogleOauthClient
  def credentials
    raise NotImplementedError, 'No credentials provided'
  end

  def new_auth_client(creds = credentials)
    Signet::OAuth2::Client.new(JSON.parse(creds))
  end
end
