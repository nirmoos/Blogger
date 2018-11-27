json.comment do
  json.(@comment, :id, :body, :created_at)
  json.likes @comment.likes.count
  json.like_status 'Like'
end

json.user do
  json.(current_user, :id, :firstname, :lastname)
end
