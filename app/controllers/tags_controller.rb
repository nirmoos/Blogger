class TagsController < ApplicationController

  def index
    tag = Tag.find(params[:id])
    @articles = tag.articles

    @drafted_articles = Article.where({ user_id: current_user.id, is_drafted: true })

    @users = User.where(id: @articles.select(:user_id))

    render 'articles/index.json.jbuilder'
  end

  def search
    search_text = params[:search_text]
    tags = Tag.select('id', 'name').where('name LIKE ?', "#{search_text}%")
    render json: tags
  end

end
