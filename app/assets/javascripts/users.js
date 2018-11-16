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

function blockOrUnblock () {
  let option = $('.show-user-block').text();
  let user_id_to_block = $('.show-user-block').data('id');

  $.ajax({
    method: 'post',
    url: 'block_option',
    data: {
      option: option.trim().toLowerCase(),
      user_id: user_id_to_block,
    },
    success: function () {
      $('.show-user-block').text(option.trim() === 'Block' ? 'Unblock' : 'Block');
    },
  });
}
