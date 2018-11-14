Rails.application.routes.draw do

  root to: 'articles#index'

  resources :articles do
    resources :comments, shallow: true
    collection do
      post 'draft'
    end
  end
  get 'allfeed', to: 'articles#allfeed'
  get 'personelfeed', to: 'articles#personelfeed'
  get 'myfeed', to: 'articles#myfeed'
  post 'create_comment', to: 'comments#create'

  devise_for :users, path: '', path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'signup' }

  resources :users, only: [:show] do
    collection do
      post 'follow_option'
      post 'block_option'
      post 'likes'
    end
  end
  post '/search_user', to: 'users#search_user'

end
