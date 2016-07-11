Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'calendar#index'

  get 'oauth2callback' => 'calendar#authenticate'

  get 'list_events' => 'calendar#list_events'

  resources :events, only: [:create]
end
