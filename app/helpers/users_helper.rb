module UsersHelper
  def user_avatar(user_id)
    user = User.find(user_id)
    if user.avatar.attached?
        image_tag user.avatar
    else
        image_tag 'default_image.png'
    end
  end
  def user_cover(user_id)
    user = User.find(user_id)
    if user.cover.attached?
        image_tag user.cover
    else
      image_tag 'default_cover.png'
    end
  end
end
