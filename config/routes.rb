Rails.application.routes.draw do

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount ActionCable.server => '/cable'

  root 'calendar#index'
  get 'oauth2callback' => 'authentication#authenticate'
  post 'notify/:conference_room_id' => 'notification#receive', as: :notifications

  resources :conference_rooms, only: [] do
    member do
      get 'events', controller: 'events', action: 'room_index'
    end
    resources :events, only: [], param: :event_id do
      member do
        post 'confirm'
        post 'finish'
      end
    end
  end

  resources :contacts, only: [:index]

  resources :events, only: [:create, :index, :show, :destroy]

  resources :conference_rooms, only: [:show], param: :title
end
