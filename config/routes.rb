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
  get '/search_user', to: 'users#search'
  get '/search_article', to: 'articles#search'
  get '/search_tag', to: 'tags#search'

  get '/tags/:id', to: 'tags#index', :as => :tag
  get '/load_comments.json', to: 'comments#load_comments'
  get '/likes.json', to: 'likes#load_likes'
  get '/user_followings.json', to: 'users#user_followings'
  get '/user_followers.json', to: 'users#user_followers'
end
