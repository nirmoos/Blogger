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
function onCommentClick ( event ) {
  let div = $('<div />').append(
    $('<form />', { action: 'create_comment', method: 'POST' }).append(
      $('<input />', { name: 'comment[belong]', type: 'text', value: event.target.dataset.belong }),
      $('<input />', { name: 'comment[id]', type: 'text', value: event.target.dataset.id }),
      $('<input />', { name: 'comment[body]', placeholder: 'write your comment here...', type: 'text' }),
      $('<input />', { type: 'submit', value: 'Save' })
    )
  )
  if (event.target.dataset.belong === 'article')
    $(".article-list-footer").after(div);
  else
    $(".comment-footer").after(div);
}
