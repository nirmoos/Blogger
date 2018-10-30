Rails.application.routes.draw do

  root to: 'articles#index'

  resources :articles do
    resources :comments, shallow: true
  end

  devise_for :users, path: '', path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'signup' }

end
