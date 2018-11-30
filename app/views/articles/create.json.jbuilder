json.comment do
  json.(@comment, :id, :body)
  json.created_at time_ago_in_words(@comment.created_at) + ' ago'
  json.likes @comment.likes.count
  json.like_status 'Like'
  json.is_deleted @comment.is_deleted
  json.user_id @comment.user_id
end

json.user do
  json.(current_user, :id, :firstname, :lastname)
  json.image user_avatar(current_user.id)
end

json.is_admin current_user.admin?
