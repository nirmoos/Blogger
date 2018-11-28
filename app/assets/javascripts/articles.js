




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
        for ( let obj of data ) {
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
  let text = event.target.dataset.action.toLowerCase();
  $.ajax({
    method: "POST",
    url: "/users/likes",
    data: {
      source: source,
      id: event.target.dataset.id,
      option: text,
    },
    success: function () {
      let new_option = text === 'like' ? 'Unlike' : 'Like';
      $(event.target).text(new_option);
      event.target.dataset.action = new_option;
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
    $('<form />', { action: '/create_comment', method: 'POST' }).append(
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

function onCommentClickAjax ( event ) {
  if ($('.comment-form-wrapper').length === 1) {
    $('.comment-form-wrapper').remove();
    return
  }
  let div = $('<div />', { class: 'comment-form-wrapper'}).append(
    $("<input />", {
      type: 'text',
      class: 'comment-new',
      placeholder: 'write your reply here...',
      onkeyup: 'createThisComment(event)',
     }).attr({
      'data-belong': event.target.dataset.belong,
      'data-id': event.target.dataset.id
    }),
  );

  if (event.target.dataset.belong == 'article')
    $(event.target).parent().siblings('.comment-list').append(div);
  else
    $(event.target).parent().after(div);

}
function createThisComment(event) {
  if (event.keyCode != 13)
    return;
  let belong = event.target.dataset.belong;
  let id = event.target.dataset.id;
  let body = $(event.target).val();
  $.ajax({
    method: "POST",
    url: "/create_comment.json",
    data: {
      'comment': {
        'belong': belong,
        'id': id,
        'body': body,
      },
    },
    success: function (data) {
      $(event.target).parent().replaceWith(
        createandAppendNewComment(data, belong),
      );
    },
  })
}
function showDraftedArticles (event) {
  event.preventDefault();
  $.get(
    $(event.target).attr("href") + '.json',
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
}
function deleteTagName(event) {
  $(event.target).remove();
}
function createandAppendNewComment({ comment, user }, belong) {
  let class_name = '' + ((belong == 'comment') ? ' comment-wrapper-padding' : '')
  let div = $("<div />", { class: class_name }).append(
    $("<div />", { class: 'comment-header' }).append(
      $("<div />", { class: 'image-comment-wrapper' }).append(
        $("<div />", { class: 'comment-image' }).append(
          $(user.image),
        ),
        $("<div />", { class: 'comment-only-wrapper' }).append(
          $("<a />", { href: '/users/' + user.id }).append(
            $("<span />", { class: 'commenter-name' }).text(
              user.firstname + ' ' + user.lastname + ' '
            ),
          ),
          $("<span />", { class: 'commenter-body' }).text(
            comment.body
          ),
          $("<div />", { class: 'comment-likes-count' }).text(' ' + comment.likes).prepend(
            $("<i />", { class: 'fas fa-thumbs-up' })
          ),
        ),
      ),
    ),
    $("<div />", { class: "comment-footer" }).append(
      $("<span />", { class: "like-box", onclick: "onLikeButtonClick(event, 'comment')" }).append(
      ).attr({ 'data-id': comment.id, 'data-action': comment.like_status.toLowerCase() }).text(comment.like_status),
      $("<span />").text('.'),
      $("<span />", { class: "comment-box", onclick: "onCommentClickAjax(event)" }).attr({ 'data-belong': 'comment', 'data-id': comment.id }).text(
        'Comment'
      ),
      $("<span />").text('.'),
      $("<span />").text(comment.created_at),
    ),

  );
  return div;
}
$(document).click(function(event){
  if (event.target.id === '#search-results')
      return false;
  $("#search-results").hide();
});
