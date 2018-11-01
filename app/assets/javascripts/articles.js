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
