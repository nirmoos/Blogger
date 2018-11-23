class UsersController < ApplicationController

  def search
    search_text = params[:search_text]
    users = User.select('id', 'firstname', 'lastname').where('firstname LIKE ?', "#{search_text}%").where.not(['firstname= ? and lastname= ?', current_user.firstname, current_user.lastname])
    render json: users
  end

  def show
    @user = User.find(params[:id])
    @articles = @user.articles.all
    @drafted_articles = Article.where({ user_id: current_user.id, is_drafted: true })
  end

  def follow_option
    reffered_user = User.find(params[:user_id].to_i)
    if params[:option] == 'follow'
      current_user.following << reffered_user
    else
      current_user.following.delete(reffered_user)
    end
    head :ok
  end

  def block_option
    reffered_user = User.find(params[:user_id].to_i)
    if params[:option] == 'block'
      reffered_user.update_attributes(is_blocked: true)
    else
      reffered_user.update_attributes(is_blocked: false)
    end
    head :ok
  end

  def likes
    if params[:option] == 'like'
      if params[:source] == 'article'
        article = Article.find(params[:id]);
        article.likes.create(user_id: current_user.id);
      else
        comment = Comment.find(params[:id]);
        comment.likes.create(user_id: current_user.id);
      end
    else
      like = Like.find_by(
        user_id: current_user.id,
        likable_type: params[:source] == 'article' ? 'Article' : 'Comment',
        likable_id: params[:id],
      );
      Like.destroy(like.id);
    end
    head :ok
  end

end
