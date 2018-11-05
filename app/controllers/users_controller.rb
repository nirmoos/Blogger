class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:search_user]
  def search_user
    search_text = params[:search_text]
    @users = User.select('id', 'firstname', 'lastname').where('firstname LIKE ?', "%#{search_text}%").where.not(['firstname= ? and lastname= ?', current_user.firstname, current_user.lastname])
    render json: @users
  end

  def show
    @user = User.find(params[:id])
    @articles = @user.articles.all
  end

  def follow_option
    @reffered_user = User.find(params[:user_id].to_i)
    if params[:option] == 'follow'
      current_user.following << @reffered_user
    else
      current_user.following.delete(@reffered_user)
    end
    head :ok
  end

  def block_option
    @reffered_user = User.find(params[:user_id].to_i)
    if params[:option] == 'block'
      @reffered_user.update_attributes(is_blocked: true)
    else
      @reffered_user.update_attributes(is_blocked: false)
    end
    head :ok
  end

end
