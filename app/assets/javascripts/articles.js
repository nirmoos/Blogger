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
    url: "some.php",
    data: { name: "John", location: "Boston" }
  })
  .done(function( msg ) {
    alert( "Data Saved: " + msg );
  });
}
