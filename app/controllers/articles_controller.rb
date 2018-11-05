class ArticlesController < ApplicationController

  def index
    @articles = Article.where({ispublic: true})
  end

  def show
    @article = Article.find(params[:id])
  end

  def edit
    @article = Article.find(params[:id])
  end

  def create
    user = User.find(current_user.id)
    user.articles.create(article_params)

    redirect_to articles_path
    # if @article.save
    #   redirect_to articles_path
    # else
    #   render articles_path
    # end
  end

  def update
    @article = Article.find(params[:id])

    if @article.update(article_params)
      redirect_to @article
    else
      render 'edit'
    end
  end

  def destroy
    @article = Article.find(params[:id])
    @article.destroy

    redirect_to articles_path
  end

  def allfeed
    @articles = Article.where({ispublic: true})
    render 'index'
  end

  def personelfeed
    @articles = Article.joins(:user).where(user_id: current_user.following.map(&:id))
    render 'index'
  end
  private
    def article_params
      params.require(:article).permit(:title, :content, :ispublic)
    end
end
