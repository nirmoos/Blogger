class ArticlesController < ApplicationController

  def index
    respond_to do |format|
      format.html { index_html }
      format.json { index_json }
    end
  end

  def index_html
    @articles = Article.where({ ispublic: true, is_drafted: false })
    @drafted_articles = Article.where({ user_id: current_user.id, is_drafted: true })
  end
  def index_json
    user = User.find(params[:id])
    @articles = user.articles
    @users = User.where(id: @articles.select(:user_id))

    render 'index.json.jbuilder'
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
    if (fo = params[:fo].to_i) != 0
      @articles = Article.where("created_at > ? ", fo.days.ago).where({ ispublic: true, is_drafted: false })
    else
      @articles = Article.where({ ispublic: true, is_drafted: false })
    end
    @users = User.where(id: @articles.select(:user_id))

    render 'index.json.jbuilder'
  end

  def personelfeed
    if (fo = params[:fo].to_i) != 0
      @articles = Article.where("created_at > ? ", fo.days.ago).where({ is_drafted: false }).where(user_id: current_user.following.map(&:id))
    else
      @articles = Article.where({ is_drafted: false }).where(user_id: current_user.following.map(&:id))
    end
    @users = User.where(id: @articles.select(:user_id))

    render 'index.json.jbuilder'
  end

  def myfeed
    if (fo = params[:fo].to_i) != 0
      # p 'FFFFFFFFFFFFFFFOOOOOOOOOOOOOOOOOOO'
      # p fo
      # p 'FFFFFFFFFFFFFFFOOOOOOOOOOOOOOOOOOO'
      @articles = Article.where("created_at > ? ", fo.days.ago).where({ is_drafted: false, user_id: current_user.id })
    else
      @articles = Article.where({ is_drafted: false }).where(user_id: current_user.id)
    end
    @users = User.where(id: @articles.select(:user_id))

    # snt = @articles.count
    # cnt = @users.count
    # p '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$'
    # p snt
    # p cnt
    # p '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$'

    render 'index.json.jbuilder'
  end

  private
    def article_params
      params.require(:article).permit(:title, :content, :ispublic, :is_drafted)
    end
end
