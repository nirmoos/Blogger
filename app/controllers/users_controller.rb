class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:search_user]
  def search_user
    search_text = params[:search_text]
    @users = User.select('id', 'firstname', 'lastname').where('firstname LIKE ?', "%#{search_text}%")
    render json: @users
  end

  def show
    @user = User.find(params[:id])
    @articles = @user.articles.all
  end
end
