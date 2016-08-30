require Rails.root.join('config/environments/shared_config')

Rails.application.configure do
  config.web_socket_server_url = 'wss://u2i-confy.herokuapp.com/cable'
  config.action_cable.allowed_request_origins = ['https://u2i-confy.herokuapp.com', 'http://u2i-confy.herokuapp.com']
end
