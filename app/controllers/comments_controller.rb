class CommentsController < ApplicationController

  def create
    if params[:comment][:belong] == 'article'
      article = Article.find(params[:comment][:id]);
      @comment = article.comments.create(user_id: current_user.id, body: params[:comment][:body]);
    else
      comment = Comment.find(params[:comment][:id]);
      @comment = comment.replies.create(user_id: current_user.id, body: params[:comment][:body]);
    end
    # respond_to do |format|
    #   format.json { create.json.jbuilder }
    # end
  end

  def update
    comment = Comment.find(params[:id]);
    comment.update_attributes(is_deleted: false);

    redirect_to articles_path
  end

  def destroy
    comment = Comment.find(params[:id]);
    comment.update_attributes(is_deleted: true);

    redirect_to articles_path
  end

  private
    def comment_params
      params.require(:comment).permit(:body)
    end
end
