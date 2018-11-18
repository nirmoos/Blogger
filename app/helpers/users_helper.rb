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
    image_tag 'default_cover.jpeg'
  end
end
