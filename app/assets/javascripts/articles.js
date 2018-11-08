function toggleAccountmenu () {
  if (($('.logout-link').css('display')) == 'none')
   $(".logout-link").show();
  else
   $(".logout-link").hide();
}
function onSearchButtonClick () {
  let text = $('.search-container input').val();
  $.ajax({
    method: "POST",
    url: "search_user",
    data: { search_text: text }
  })
  .done(function ( data ) {
    let wrapper = $('.search-results').empty().show();
    for ( let obj of data ){
      let a = $('<a href='+ '/users/'+ obj.id +'></a>').text(obj.firstname + ' ' + obj.lastname);
      wrapper.append($('<hr>'), $('<div></div>').append(a));
    }
  });
}
$(function () {
  $('.search-container input').on('focusout', function() {
    // $('.search-results').hide();
  });
});
const style = 'display: none;'
function onCommentClick ( event ) {
  if ($('.comment-form-wrapper').length === 1) {
    $('.comment-form-wrapper').remove();
    return
  }
  let div = $('<div />', { class: 'comment-form-wrapper'}).append(
    $('<form />', { action: 'create_comment', method: 'POST' }).append(
      $('<input />', { name: 'comment[belong]', style: style, type: 'text', value: event.target.dataset.belong }),
      $('<input />', { name: 'comment[id]', style: style, type: 'text', value: event.target.dataset.id }),
      $('<input />', { name: 'comment[body]', class: 'comment-new', placeholder: 'write your comment here...', type: 'text' }),
      $('<div />', { class: 'cancel-save-wrapper' }).append(
        $('<button />', { value: 'Cancel', onclick: 'onCommentClick(event)', type: 'button' }),
        $('<input />', { type: 'submit', class: 'comment-submit', value: 'Save' })
      ),
    )
  )
  console.log($(event.target).parent());
  $(event.target).parent().after(div);
}
