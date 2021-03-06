json.comments @comments do |comment|
  json.(comment, :id, :is_deleted, :user_id)
  json.body comment.is_deleted ? '[Comment is deleted by admin.]' : comment.body
  json.likes comment.likes.count
  json.created_at time_ago_in_words(comment.created_at) + ' ago'
  json.replies comment.replies.count
  json.like_status current_user.likes.where({likable_id: comment.id, likable_type: 'Comment'}).any? ? 'Unlike' : 'Like'
  json.is_deleted comment.is_deleted
end

json.users @users do |user|
  json.(user, :firstname, :lastname, :email)
  json.id user.user_id
  json.image user_avatar(user.user_id)
end

json.is_admin current_user.admin?
