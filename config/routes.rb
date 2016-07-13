Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'calendar#index'

  get 'oauth2callback' => 'calendar#authenticate'

  get 'google_index' => 'calendar#google_index'

  get 'free_rooms' => 'calendar#free_rooms'

  resources :events, only: [:create]
end
