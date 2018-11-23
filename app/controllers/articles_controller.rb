class ArticlesController < ApplicationController

  def index
    @articles = Article.where({ ispublic: true, is_drafted: false })
    @drafted_articles = Article.where({ user_id: current_user.id, is_drafted: true })
  end

  def create
    if params[:article].has_key? 'id'
      article = Article.find_by(id: params[:article][:id])
      article.update_attributes(is_drafted: false, title: params[:article][:title], content: params[:article][:content], ispublic: params[:article][:ispublic])
    else
      article = current_user.articles.create(article_params)
    end
    if params[:article][:tags] != nil
      params[:article][:tags].each do | key, value |
        if Tag.find_by({ name: value }) != nil
          tag = Tag.find_by({ name: value })
        else
          tag = Tag.create(name: value)
        end
        article.article_tags.create(tag: tag)
      end
    end

    redirect_to root_path
  end

  def show
    @article = Article.find(params[:id])
    @drafted_articles = Article.where({ user_id: current_user.id, is_drafted: true })
    respond_to do |format|
      format.html
      format.json { render json: @article.as_json(only: [:id, :title, :content, :ispublic]) }
    end
  end

  def draft
    if params[:article][:id] != 'nil'
      article = Article.find_by(id: params[:article][:id])
      article.update_attributes(article_params)
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

  def search
    search_text = params[:search_text]
    articles = Article.select('id', 'title').where('title LIKE ?', "%#{search_text}%")
    render json: articles
  end

  def allfeed
    @articles = Article.where({ ispublic: true, is_drafted: false })
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
