json.comment do
  json.(@comment, :id, :body)
  json.created_at time_ago_in_words(@comment.created_at) + ' ago'
  json.likes @comment.likes.count
  json.like_status 'Like'
end

json.user do
  json.(current_user, :id, :firstname, :lastname)
  json.image user_avatar(current_user.id)
end
