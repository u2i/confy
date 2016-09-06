Rails.application.routes.draw do

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount ActionCable.server => '/cable'

  root 'calendar#index'
  get 'oauth2callback' => 'authentication#authenticate'
  post 'notify/:conference_room_id' => 'notification#receive', as: :notifications
  get 'conference_rooms/:conference_room_id/events' => 'events#room_index'
  post 'events/confirm' => 'events#confirm'


  resources :contacts, only: [:index]

  resources :events, only: [:create, :index, :show, :destroy]
end
