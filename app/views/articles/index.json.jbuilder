json.articles @articles do |article|
  json.(article, :id, :title, :content, :ispublic, :created_at, :user_id)
  json.tags article.tags.map(&:name)
  json.likes article.likes.count
  json.comments article.comments.count
end

json.users @users do |user|
  json.(user, :id, :firstname, :lastname, :email)
end
