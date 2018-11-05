class ArticlesController < ApplicationController

  def index
    @articles = Article.where({ispublic: true})
  end

  def create
    current_user.articles.create(article_params)

    redirect_to articles_path
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

  def myfeed
    @articles = current_user.articles
    render 'index'
  end
  
  private
    def article_params
      params.require(:article).permit(:title, :content, :ispublic)
    end
end
