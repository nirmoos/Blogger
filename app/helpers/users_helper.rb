module UsersHelper
  def user_avatar(user_id)
    user = User.find(user_id)
    if user.avatar.attached?
        image_tag user.avatar
    else
        image_tag 'default_image.jpg'
    end
  end
end
