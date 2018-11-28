class LikesController < ApplicationController
  def load_likes
    user = User.find(params[:id])
    @articles = Article.where(id: user.likes.where({likable_type: 'Article'}).select(:likable_id))
    @users = User.where(id: @articles.select(:user_id))

    render 'articles/index.json.jbuilder'
  end
end
