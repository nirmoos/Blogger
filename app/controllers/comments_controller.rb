class CommentsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  def create
    if params[:comment][:belong] == 'article'
      @instance = Article.find(params[:comment][:id]);
      @instance.comments.create(user_id: current_user.id, body: params[:comment][:body]);
    else
      @instance = Comment.find(params[:comment][:id]);
      @instance.replies.create(user_id: current_user.id, body: params[:comment][:body]);
    end

    redirect_to root_path
  end

  def destroy
    @article = Article.find(params[:article_id])
    @comment = @article.comments.find(params[:id])
    @comment.destroy
    redirect_to article_path(@article)
  end

  private
    def comment_params
      params.require(:comment).permit(:body)
    end
end
