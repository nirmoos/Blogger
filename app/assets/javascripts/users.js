class Article {
  constructor () {
    this.articles = [];
    this.active = 'articles';
  }
  updateandRender(event, articles) {
    this.articles = articles;
    $(".user-page-render-space").empty();
    for (let article of articles) {
      renderArticles(article);
    }
  }
}

const article = new Article();

class User {
  constructor () {
    this.users = [];
    this.active = 'following';
  }
  updateUserList(users) {
    this.users = users;
  }
  addUsers(users) {
    this.users.push(...users);
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

$(document).ready(function() {
  $(".indicator_parent").on("click", function(event) {
    switch ($(this).attr("data-for")) {
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
      data: { id: $(this).attr("data-id") },
      success: function (data) {
        $(".user-page-render-space").empty();
        switch (action) {
          case 'article':
          case 'like':
                      user.updateUserList(data.users);
                      article.updateandRender(event, data.articles);
                      break;
          case 'user':
                      $(".user-page-render-space").append(
                        $("<div />", { class: 'user-list-wrapper' }).append(
                          data.users.map( user => renderUsers( user ) ),
                        ),
                      );
                      break;
          default:
        }
      }
    });
  });
});

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
function renderArticles(article) {
  $(".user-page-render-space").append(
    $("<section />", { class: "article-list" }).append(
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
          $("<a />", { href: '/tags/' + tag.id }).append(
            $("<span />", { class: "tagger" }).text('#' + tag.name + ' '),
          ),
        )
      ),
      $("<div />", { class: "article-list-header" }).text(article.title),
      $("<div />", { class: "article-list-boldy" }).text(article.content),
      $("<hr />"),
      $("<div />", { class: "likes-comments-counter" }).append(
        $("<div />").text(article.likes + ' ' + 'likes'),
        $("<div />").text(article.comments + ' ' + 'comments'),
      ),
      $("<hr />"),
      $("<div />", { class: "article-list-footer" }).append(
        $("<div />", { class: "article-like", onclick: "onLikeButtonClick(event, 'article')"}).attr({ 'data-id': article.id, 'data-action': article.like_status.toLowerCase() }).append(
          $("<i />", { class: "far fa-thumbs-up"})
        ).text(article.like_status),
        $("<div />", { class: "article-comment", onclick: "onCommentClickAjax(event)" }).attr({ 'data-belong': "article", 'data-id': article.id }).append(
          $("<i />", { class: "far fa-comment "}).text('Comment')
        )
      ),
      $("<hr />"),
      $("<div />", { class: "comment-list" }).append(
        article.comments ? $("<div />", { class: "load-more-comments", onclick: "loadMoreComments(event, true)" }).attr({
          'data-belong': 'article', 'data-id': article.id
        }).text('Load more comments...') : '',
      ),
    ),
  );
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
      $("<span />").text('.'),
      $("<span />").text(comment.created_at),
    ),

  );
  return div;
}


function renderUsers(user) {
  console.log("jhjhghg")
  let div = $("<div />", { class: "user-profile-in-list" }).append(
    $("<div />", { class: "user-cover-image" }).append(user.cover_image),
    $("<div />", { class: "user-avatar-in-profile" }).append(user.profile_image),
    $("<div />", { class: "user-profile-name" }).append(
      $("<div />", { class: "profile-name" }).text(user.firstname + ' ' + user.lastname),
      $("<div />", { class: "profile-email" }).text(user.email),
    ),

    $("<div />", { class: "optional-follow-user-list", onclick: 'followOrBlock(event)' }).attr({
      'data-action': user.follow_status ? 'Unfollow' : 'Follow',
      'data-id': user.id,
    }).text(user.follow_status ? 'Unfollow' : 'Follow'),
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
