
function onSearchButtonClick () {
  let text = $('.search-container input').val();
  let action = text.slice(0, 1);
  let operation = action == '@' ? 'article' : (action == '#' ?  'tag' : 'user');
  let search_text = (action === '@' || action === '#') ? text.slice(1, text.length) : text;
  if (search_text.length == 0) {
    $('.search-results').hide();
    return;
  }
  $.ajax({
    method: "GET",
    url: "/search_" + operation,
    data: { search_text: search_text }
  })
  .done(function ( data ) {
    let wrapper = $('.search-results').empty().show();
    switch (operation) {
      case 'user':
        for ( let obj of data ){
          let a = $('<a href='+ '/users/'+ obj.id +'></a>').text(obj.firstname + ' ' + obj.lastname);
          wrapper.append($('<hr>'), $('<div></div>').append(a));
        }
        break;
      case 'article':
        for ( let obj of data ){
          title = obj.title
          pos = title.search(search_text);
          let a = $('<a href='+ '/articles/'+ obj.id +'></a>').html('@' + title.slice(0, pos) + "<span class='title-highlighter'>" + title.slice(pos, search_text.length + pos) + "</span>" + title.slice(search_text.length + pos, title.length));
          wrapper.append($('<hr>'), $('<div></div>').append(a));
        }
        break;
      case 'tag':
        for ( let obj of data ){
          name = obj.name
          pos = name.search(search_text);
          let a = $('<a href='+ '/tags/'+ obj.id +'></a>').html('#' + name.slice(0, pos) + "<span class='title-highlighter'>" + name.slice(pos, search_text.length + pos) + "</span>" + name.slice(search_text.length + pos, name.length));
          wrapper.append($('<hr>'), $('<div></div>').append(a));
        }
        break;
      default:

    }
  });
}
function makeItDraft () {
  $.ajax({
    method: "POST",
    url: "/articles/draft",
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
      $('<a class="dropdown-item" href=/articles/${data.id}.json>' + $("#article_title").val() + '</a>')
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
    url: "/users/likes",
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
        $('<input />', { type: 'submit', style: 'display: none;', class: 'comment-submit', value: 'Save' })
      ),
    )
  )
  $(event.target).parent().after(div);
}
function showDraftedArticles (event) {
  event.preventDefault();
  $.get(
    $(event.target).attr("href")+'.json',
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
function onTagSubmit(event) {
  if (event.keyCode == 13) {
    $("#article-tag-list").prepend(
      $('<li />', { class: "listed-tag-name", text: event.target.value, onclick: "deleteTagName(event)" }).append(
        $("<span />", { class: "listed-tag-name-deletor" }).append(
          $("<i />", { class: "fas fa-times"}),
        ),
      ),
    );
    $(event.target).val("");
  }
}
function onArticleSubmit(event) {
  let jObjects = $(".listed-tag-name");
  let jLength = $(".listed-tag-name").length;
  for (let i=0; i<jLength; i++) {
    $("#article_ispublic").after(
      $('<input />', { name: 'article[tags][' + i + ']', style: 'display: none;', type: 'text', value: jObjects[i].textContent }),
    );
  }

  // event.preventDefault();
}
function deleteTagName(event) {
  $(event.target).remove();
}
