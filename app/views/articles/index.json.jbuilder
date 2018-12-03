json.articles @articles do |article|
  json.(article, :id, :title, :content, :ispublic, :user_id)
  json.tags article.tags
  json.created_at time_ago_in_words(article.created_at) + ' ago'
  json.likes article.likes.count
  json.like_status current_user.likes.where({likable_id: article.id, likable_type: 'Article'}).any? ? 'Unlike' : 'Like'
  json.comments article.comments.count
end

json.users @users do |user|
  json.(user, :id, :firstname, :lastname, :email)
  json.image user_avatar(current_user.id)
end

json.is_admin current_user.admin?
