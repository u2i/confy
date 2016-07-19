Rails.application.routes.draw do
  get 'hello_world', to: 'hello_world#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'calendar#index'

  get 'oauth2callback' => 'calendar#authenticate'

  get 'google_index' => 'calendar#google_index'

  resources :events, only: [:create, :index, :show]
end
