Rails.application.routes.draw do

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount ActionCable.server => '/cable'

  root 'calendar#index'
  get 'oauth2callback' => 'authentication#authenticate'
  get 'healthz' => 'health#check_health'
  post 'notify/:conference_room_id' => 'notification#receive', as: :notifications
  get 'admin' => 'admin/conference_rooms#index'

  namespace :admin do
    resources :conference_rooms, except: [:show]
    resources :devices, except: [:show, :create, :new]
  end

  namespace :api do
    resources :conference_rooms, only: [:index], defaults: { format: :json }
    resources :devices, except: [:index, :edit, :new], defaults: { format: :json }
    resources :events, param: :event_id,
                       defaults: { format: :json } do
      member do
        post :confirm
        post :finish
      end
      collection do
        get :confirmed
      end
    end
  end

  resources :conference_rooms, only: [] do
    member do
      get :events, controller: :events, action: :room_index
    end
    resources :events, only: [:update], param: :event_id do
      member do
        post :confirm
        post :finish
      end
    end
  end

  resources :contacts, only: [:index]

  resources :events, only: [:create, :index, :show, :destroy] do
    collection do
      get :confirmed
    end
  end

  resources :conference_rooms, only: [:index, :show], param: :title
end
