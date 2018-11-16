class ArticlesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:draft]

  def index
    @articles = Article.where({ ispublic: true })
    @drafted_articles = Article.where({ user_id: current_user.id, is_drafted: true })
  end

  def create
    if params[:article].has_key? 'id'
      article = Article.find_by(id: params[:article][:id])
      article.update_attributes(is_drafted: false, title: params[:article][:title], content: params[:article][:content], ispublic: params[:article][:ispublic])
    else
      current_user.articles.create(article_params)
    end

    redirect_to articles_path
  end

  def show
    article = Article.find(params[:id])
    render json: article.as_json(only: [:id, :title, :content, :ispublic])
  end

  def draft
    p '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'
    p params
    p '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'
    if params[:article].has_key? 'id'
      article = Article.find_by(id: params[:article][:id])
      article.update_attributes(is_drafted: false, title: params[:article][:title], content: params[:article][:content], ispublic: params[:article][:ispublic])
    else
      article = current_user.articles.create(article_params)
    end

    render json: { id: article.id }
  end

  def destroy
    article = Article.find(params[:id])
    article.destroy

    redirect_to root_path
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
      params.require(:article).permit(:title, :content, :ispublic, :is_drafted)
    end
end
