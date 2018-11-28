class CommentsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]

  def create
    if params[:comment][:belong] == 'article'
      article = Article.find(params[:comment][:id]);
      @comment = article.comments.create(user_id: current_user.id, body: params[:comment][:body]);
    else
      comment = Comment.find(params[:comment][:id]);
      @comment = comment.replies.create(user_id: current_user.id, body: params[:comment][:body]);
    end
    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render 'articles/create.json.jbuilder' }
    end
  end

  def update
    comment = Comment.find(params[:id]);
    comment.update_attributes(is_deleted: false);

    redirect_to root_path
  end

  def load_comments
    if params[:belong] == 'article'
      article = Article.find(params[:id]);
      @comments = article.comments
    else
      comment = Comment.find(params[:id]);
      @comments = comment.replies;
    end
    @users = @comments.joins(:user).distinct.select('user_id', 'firstname', 'lastname', 'email')
    render 'articles/load_comments.json.jbuilder'
  end

  def destroy
    comment = Comment.find(params[:id]);
    comment.update_attributes(is_deleted: true);

    redirect_to root_path
  end

  private
    def comment_params
      params.require(:comment).permit(:body)
    end
end
