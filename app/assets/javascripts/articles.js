
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
function makeItDraft () {
  $.ajax({
    method: "POST",
    url: "articles/draft",
    data: {
      "article": {
        "title": $("#article_title").val(),
        "content": $("#article_content").val(),
        "ispublic": $("#article_ispublic").val(),
        "id": $("#article_id").length != 0 ? $("#article_id").val() : 'nil',
        "is_drafted": true,
      }
    }
  })
  .done(function ( data ) {
    $("#show-drafted-articles").append(
      $('<a class="dropdown-item" href=/articles/${data.id}>' + $("#article_title").val() + '</a>')
    );
    $("#article_title").val("");
    $("#article_content").val("");
    $("#article_ispublic").val("Public");
  });
}
function onLikeButtonClick (event, source) {
  let text = event.target.textContent.trim().toLowerCase();
  $.ajax({
    method: "POST",
    url: "users/likes",
    data: {
      source: source,
      id: event.target.dataset.id,
      option: text,
    },
    success: function () {
      $(event.target).text(text === 'like' ? 'Unlike' : 'Like');
      if (text === 'like' && source === 'article')
        $(event.target).prepend("<i class='far fa-thumbs-down'></i>");
      else if(text === 'unlike' && source === 'article')
        $(event.target).prepend("<i class='far fa-thumbs-up'></i>");
    },
  })
}

function onCommentClick ( event ) {
  if ($('.comment-form-wrapper').length === 1) {
    $('.comment-form-wrapper').remove();
    return
  }
  let div = $('<div />', { class: 'comment-form-wrapper'}).append(
    $('<form />', { action: 'create_comment', method: 'POST' }).append(
      $('<input />', { name: 'comment[belong]', style: 'display: none;', type: 'text', value: event.target.dataset.belong }),
      $('<input />', { name: 'comment[id]', style: 'display: none;', type: 'text', value: event.target.dataset.id }),
      $('<input />', { name: 'comment[body]', class: 'comment-new', placeholder: 'write your comment here...', type: 'text' }),
      $('<div />', { class: 'cancel-save-wrapper' }).append(
        // $('<button />', { text: 'Cancel', onclick: 'onCommentClick(event)', type: 'button' }),
        $('<input />', { type: 'submit', class: 'comment-submit', value: 'Save' })
      ),
    )
  )
  $(event.target).parent().after(div);
}
function showDraftedArticles (event) {
  event.preventDefault();
  $.get(
    $(event.target).attr("href"),
    function( data ) {
      $("#article_title").val(data.title);
      $("#article_content").val(data.content);
      $("#article_ispublic").val(data.ispublic ? "Public" : "Private");
      $("#article_ispublic").after(
        $('<input />', { name: 'article[id]', id: 'article_id', style: 'display: none;', type: 'text', value: data.id })
      );
    }
  );
}
