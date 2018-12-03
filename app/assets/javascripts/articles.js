var feedSelction = 'all-feed';

class User {
  constructor () {
    this.users = [];
    this.active = 'following';
    this.isAdmin = false;
  }
  updateUserList(users) {
    this.users = users;
  }
  updateAdminStatus(status) {
    this.isAdmin = status;
  }
  addUsers(users) {
    this.users.push(...users);
  }
  isUserAdmin() {
    return this.isAdmin;
  }
  getFullname(id) {
    let user = this.findUser(id);
    return user[0].firstname + ' ' + user[0].lastname;
  }
  getUserImage(id) {
    let user = this.findUser(id);
    return user[0].image
  }
  findUser(id) {
    return this.users.filter((user) => user.id == id);
  }
}

const user = new User();

$(function () {
  $(".feed-wrapper div").click(function (event) {
    let filter_option = $(".filter-options input[name='filter']:checked").val();
    let sort_option = $(".custom-select").val();
    feedSelction = $(this).data("feed") === 'allfeed' ? 'all-feed' : (
      $(this).data("feed") === 'personelfeed' ? 'personel-feed' : 'my-feed'
    );

    $.ajax({
      method: "GET",
      url: '/' + $(this).data("feed") + '.json',
      data: {
        sort_option: sort_option,
        filter_option: filter_option,
      },
      success:
      function (data) {
        user.updateUserList(data.users);
        user.updateAdminStatus(data.is_admin);
        $(".article-main section:not(:first)").remove();
        for (let article of data.articles) {
          $(".article-main").append(
            renderArticles(article)
          );
        }
      }
    });
  });
});

$(function () {
  $("#sortOption").click(function (event) {
    $('#' + feedSelction).click();
  })
});

$(function () {
  $("#all-feed").click();
});

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
          let a = $('<div class="search-button-click" data-belong="users" data-id=' + obj.id + '></div>').text(obj.firstname + ' ' + obj.lastname);
          wrapper.append($('<hr>'), $('<div></div>').append(a));
        }
        break;
      case 'article':
        for ( let obj of data ) {
          title = obj.title
          pos = title.search(search_text);
          let a = $('<div class="search-button-click" data-belong="articles" data-id=' + obj.id + '></div>').html('@' + title.slice(0, pos) + "<span class='title-highlighter'>" + title.slice(pos, search_text.length + pos) + "</span>" + title.slice(search_text.length + pos, title.length));
          wrapper.append($('<hr>'), $('<div></div>').append(a));
        }
        break;
      case 'tag':
        for ( let obj of data ){
          name = obj.name
          pos = name.search(search_text);
          let a = $('<div class="search-button-click" data-belong="tags" data-id=' + obj.id + '></div>').html('#' + name.slice(0, pos) + "<span class='title-highlighter'>" + name.slice(pos, search_text.length + pos) + "</span>" + name.slice(search_text.length + pos, name.length));
          wrapper.append($('<hr>'), $('<div></div>').append(a));
        }
        break;
      default:

    }
  });
}

$(function (event) {
  $(".search-button-click").click(function (event) {
    console.log('insearch');
    $.ajax({
      method: "GET",
      url: '/' + $(this).data("belong") + '/' + $(this).data("id") + '.json',
      success:
      function (data) {
        user.updateUserList(data.users);
        user.updateAdminStatus(data.is_admin);
        $(".article-main section:not(:first)").remove();
        for (let article of data.articles) {
          $(".article-main").append(
            renderArticles(article)
          );
        }
      }
    });
  })
});

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

$(function () {
    $('body').on('click', '.likes-comments-counter', function(){
      event.preventDefault();
      event.stopPropagation();
      $(this).siblings('.comment-list').children().click()
    })
});

function deleteTagName(event) {
  $(event.target).remove();
}
function createandAppendNewComment({ comment, user: creator }, belong) {
  let class_name = '' + ((belong == 'comment') ? ' comment-wrapper-padding' : '')
  let div = $("<div />", { class: class_name }).append(
    $("<div />", { class: 'comment-header' }).append(
      $("<div />", { class: 'image-comment-wrapper' }).append(
        $("<div />", { class: 'comment-image' }).append(
          $(creator.image),
        ),
        $("<div />", { class: 'comment-only-wrapper' }).append(
          $("<a />", { href: '/users/' + creator.id }).append(
            $("<span />", { class: 'commenter-name' }).text(
              creator.firstname + ' ' + creator.lastname + ' '
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
      user.isUserAdmin(comment.user_id) && (
        $("<span />").text('.'),
        $("<span />", { class: "delete-box" }).append(
          $("<a />", { href: '#', onclick: "deleteThis(event)" }).attr({ 'data-method': comment.is_deleted ? 'PUT' : 'DELETE', 'data-id': comment.id, 'data-belong': 'comment' }).text(comment.is_deleted ? 'Undo Delete' : 'Delete'),
        )
      ),
      $("<span />").text(comment.created_at),
    ),

  );
  return div;
}
function renderArticles(article) {
  let section = $("<section />", { class: "article-list" }).append(
      $("<div />", { class: "article-list-creator" }).append(
        $("<div />", { class: "image-creator-wrapper" }).append(
          $("<div />", { class: "image-wrapper" }).append(
            $(user.getUserImage(article.user_id))
          ),
          $("<div />", { class: "owner-wrapper" }).append(
            $("<div />", { class: "article-owner" }).append(
              $("<a />", { href: "/users/" + article.user_id }).text(user.getFullname(article.user_id))
            ),
            $("<div />", { class: "creation-time" }).text(article.created_at)
          )
        )
      ),
      $("<div />", { class: "article-list-tags"}).append(
        article.tags.map(tag =>
          $("<div />").attr({ 'data-id': tag.id, 'data-belong': 'tags'}).append(
            $("<span />", { class: "tagger" }).text('#' + tag.name + ' '),
          ),
        )
      ),
      $("<div />", { class: "article-list-header" }).text(article.title),
      $("<div />", { class: "article-list-boldy" }).text(article.content),
      $("<hr />"),
      $("<div />", { class: "likes-comments-counter" }).append(
        $("<div />").text(article.likes + ' ' + 'likes'),
        $("<div />").append(
          $("<a />", { href: "#", class: "a-tag-for-comment" }).text(article.comments + ' ' + 'comments'),
        ),
      ),
      $("<hr />"),
      $("<div />", { class: "article-list-footer" }).append(
        $("<div />", { class: "article-like", onclick: "onLikeButtonClick(event, 'article')"}).attr({ 'data-id': article.id, 'data-action': article.like_status.toLowerCase() }).text(article.like_status).prepend(
          $("<i />", { class: "far fa-thumbs-up"})
        ),
        $("<div />", { class: "article-comment", onclick: "onCommentClickAjax(event)" }).attr({ 'data-belong': "article", 'data-id': article.id }).text('Comment').prepend(
          $("<i />", { class: "far fa-comment "})
        )
      ),
      $("<hr />"),
      $("<div />", { class: "comment-list" }).append(
        article.comments ? $("<div />", { class: "load-more-comments", onclick: "loadMoreComments(event, true)" }).attr({
          'data-belong': 'article', 'data-id': article.id
        }).text('Load more comments...') : '',
      ),
      user.isUserAdmin(article.user_id) && (
        $("<span />", { class: "delete-button-for-admin" }).append(
          $("<i />", { class: 'fas fa-trash' })
        )
      ),
    );
    return section;
}
function createandAppendThisComment(comment, belong) {
  let div = $("<div />", { class: 'comment-wrapper' }).append(
    $("<div />", { class: 'comment-header' }).append(
      $("<div />", { class: 'image-comment-wrapper' }).append(
        $("<div />", { class: 'comment-image' }).append(
          $(user.getUserImage(comment.user_id)),
        ),
        $("<div />", { class: 'comment-only-wrapper' }).append(
          $("<a />", { href: '/users/' + user.id }).append(
            $("<span />", { class: 'commenter-name' }).text(
              user.getFullname(comment.user_id) + ' '
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
      comment.replies ? $("<span />", { class: "comment-box", onclick: "loadMoreComments(event)" }).attr({ 'data-belong': 'comment', 'data-id': comment.id }).text(
        comment.replies + ' replies'
      ) : '',
      user.isUserAdmin(comment.user_id) && (
        $("<span />").text('.'),
        $("<span />", { class: "delete-box" }).append(
          $("<a />", { href: '#', onclick: "deleteThis(event)" }).attr({ 'data-method': comment.is_deleted ? 'PUT' : 'DELETE', 'data-id': comment.id, 'data-belong': 'comment' }).text(comment.is_deleted ? 'Undo Delete' : 'Delete'),
        )
      ),
      $("<span />").text('.'),
      $("<span />").text(comment.created_at),
    ),

  );
  return div;
}







class Article {
  constructor () {
    this.articles = [];
    this.active = 'articles';
  }
  updateandRender(event, articles) {
    this.articles = articles;

  }
}

const article = new Article();




$(document).ready(function() {
  $(".indicator_parent").on("click", function(event) {
    var data_for = $(this).attr("data-for");
    var data_id = $(this).attr("data-id");

    switch (data_for) {
      case 'article':
          url = 'articles.json';
          action = 'article';
        break;
      case 'likes':
          url = 'likes.json';
          action = 'like';
        break;
      case 'followers':
          url = 'user_followers.json';
          action = 'user';
        break;
      case 'following':
          url = 'user_followings.json';
          action = 'user';
        break;
      default:

    }
    $.ajax({
      method: "GET",
      url: '/' + url,
      data: { id: data_id }
    })
    .done(
      function (data) {
        switch (action) {
          case 'article':
          case 'like':
                      user.updateUserList(data.users);
                      user.updateAdminStatus(data.is_admin);
                      $(".user-page-render-space").empty();
                      for (let article of data.articles) {
                        $(".user-page-render-space").append(
                          renderArticles(article)
                        );
                      }
                      break;
          case 'user':
                $(".user-page-render-space").empty();
                $(".user-page-render-space").append(
                  $("<div />", { class: 'user-list-wrapper' }).append(
                    data.users.map( user => renderUsers( user ) ),
                  ),
                );
        }
      }
    );
  });
});

function deleteThis(event) {
  event.preventDefault();
  event.stopPropagation();
  let url;
  let id = $(event.target).data("id");
  let belong = $(event.target).data("belong");
  let method = $(event.target).data("method");
  if (belong == 'comment')
    url = '/comments/' + id;
  else
    url = '/articles/' + id;
  $.ajax({
    url: url,
    type: method,
    data: {
      id: id,
    },
    success: function(data) {
      if (belong == 'comment') {
        if (method == 'DELETE') {
          $(event.target).data("method", 'PUT');
          $(event.target).parent().parent().siblings().find('.commenter-body').text(data.text);
          $(event.target).text('Undo Delete');
        }
        else {
          $(event.target).data("method", 'DELETE');
          $(event.target).parent().parent().siblings().find('.commenter-body').text(data.text);
          $(event.target).text('Delete');

        }
      }
    }
  });
}

$(function () {
  $("#first-indicator").click();
});

function followOrBlock (event) {
  let option = $(event.target).data('action');
  let user_id = $(event.target).data('id');

  $.ajax({
    method: 'post',
    url: ['Follow', 'Unfollow'].includes(option) ? 'follow_option' : 'block_option',
    data: {
      option: option.toLowerCase(),
      user_id: user_id,
    },
    success: function () {
      let new_option = ['Follow', 'Unfollow'].includes(option) ? (
        option === 'Follow' ? 'Unfollow' : 'Follow'
      ) : (
        option === 'Block' ? 'Unblock' : 'Block'
      );
      $(event.target).data("action", new_option).text(new_option);
    },
  });
}
function loadMoreComments(event, isFirst) {
  $.ajax({
    method: 'get',
    url: '/load_comments.json',
    data: {
      belong: event.target.dataset.belong,
      id: event.target.dataset.id,
    },
    success: function (data) {
      user.addUsers(data.users);
      user.updateAdminStatus(data.is_admin);
      let parent = $(event.target).parent();
      $(event.target).remove();
      for (let comment of data.comments) {
        if (isFirst != undefined)
          parent.prepend(createandAppendThisComment(comment, event.target.dataset.belong))
        else
          parent.append(createandAppendThisComment(comment, event.target.dataset.belong))
      }
    },
  });
}

function renderUsers(user) {
  let div = $("<div />", { class: "user-profile-in-list" }).append(
    $("<div />", { class: "user-cover-image" }).append(user.cover_image),
    $("<div />", { class: "user-avatar-in-profile" }).append(user.profile_image),
    $("<div />", { class: "user-profile-name" }).append(
      $("<div />", { class: "profile-name" }).text(user.firstname + ' ' + user.lastname),
      $("<div />", { class: "profile-email" }).text(user.email),
    ),
    $("<div />", { class: "user-profile-footer" }).append(
      $("<div />", { class: "article-count" }).append(
        $("<div />").text('Articles'),
        $("<div />").text(user.articles_count),
      ),
      $("<div />", { class: "following-count" }).append(
        $("<div />").text('Following'),
        $("<div />").text(user.followings_count),
      ),
      $("<div />", { class: "followers-count" }).append(
        $("<div />").text('Followers'),
        $("<div />").text(user.followers_count),
      ),
    ),
  )
  return div;
}

$(document).click(function(event){
  if ( $(event.target).closest('.search-results').length === 0 ) {
    $("#search-results").hide();
  }
  // if (event.target.id === '#search-results')
  //     return false;
  // console.log('passedto');
});
