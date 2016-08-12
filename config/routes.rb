Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount ActionCable.server => '/cable'

  root 'calendar#index'
  get 'oauth2callback' => 'authentication#authenticate'
  get 'google_index' => 'calendar#google_index'

  resources :events, only: [:create, :index, :show, :destroy]
end
