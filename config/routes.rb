Rails.application.routes.draw do

  root to: 'articles#index'

  resources :articles do
    resources :comments, shallow: true
    collection do
      get 'allfeed'
      get 'personelfeed'
    end
  end

  devise_for :users, path: '', path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'signup' }

  resources :users, only: [:show] do
    collection do
      post 'follow_option'
    end
  end
  post '/search_user', to: 'users#search_user'

end
