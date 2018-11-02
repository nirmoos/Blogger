function followOrUnfollow () {
  let option = $('.show-user-follow').text();
  let user_id_to_follow = $('.show-user-follow').data('id');

  $.ajax({
    method: 'post',
    url: 'follow_option',
    data: {
      option: option.trim().toLowerCase(),
      user_id: user_id_to_follow,
    },
    success: function () {
      $('.show-user-follow').text(option.trim() === 'Follow' ? 'Unfollow' : 'Follow');
    },
  });
}
