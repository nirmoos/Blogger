json.users @users do |user|
  json.(user, :id, :firstname, :lastname, :email)
  json.followers_count user.followers.count
  json.followings_count user.following.count
  json.follow_status current_user.following.include?(user)
  json.articles_count user.articles.count
  json.profile_image user_avatar(user.id)
  json.cover_image user_cover(user.id)
end
