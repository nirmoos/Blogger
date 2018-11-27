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
    // console.log(this.users, users);
  }
  // updateandRender(event, users) {
  //   this.users = users;
  //   for (let user of users) {
  //     renderUsers(user);
  //   }
  // }
  getFullname(id) {
    // console.log('id:', id);
    // console.log('users:', this.users);
    // console.log(this.users, id);
    let user = this.users.filter((user) => user.id == id);
    // console.log('user:', user);
    return user.firstname + ' ' + user.lastname;
  }
}

const user = new User();

function ajaxCallforDataRendering (event) {
  let url;
  let action;
  switch (event.target.dataset.for) {
    case 'article':
        url = 'articles.json';
        action = 'article';
      break;
    case 'likes':
        url = 'likes.json';
        action = 'like';
      break;
    case 'followers':
        url = 'followers.json';
        action = 'user';
      break;
    case 'following':
        url = 'following.json';
        action = 'user';
      break;
    default:

  }
  $.ajax({
    method: "GET",
    url: '/' + url,
    data: { id: event.target.dataset.id }
  })
  .done(function (data) {
    article.updateandRender(event, data.articles);
    user.updateUserList(data.users);
    // console.log(data.users);
  });
}


$("#first-indicator").click();

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

function renderArticles(article) {
  $(".user-page-render-space").append(
    $("<section />", { class: "article-list" }).append(
      $("<div />", { class: "article-list-creator" }).append(
        $("<div />", { class: "image-creator-wrapper" }).append(
          $("<div />", { class: "image-wrapper" }).append(
            $("<img />", { src: ""})
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
          $("<span />", { class: "tagger" }).text('#' + tag)
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
        $("<div />", { class: "article-like", onclick: "onLikeButtonClick(event, 'article')"}).attr({ 'data-id': article.id }).append(
          $("<i />", { class: "far fa-thumbs-up"})
        ).text("Like"),
        $("<div />", { class: "article-comment", onclick: "onCommentClickAjax(event)" }).attr({ 'data-belong': "article", 'data-id': article.id }).append(
          $("<i />", { class: "far fa-comment "}).text('Comment')
        )
      ),
      $("<hr />"),
    ),
    $("<div />", { class: "comment-list" }).text(article.comments ? "Show all comments" : '')
  );
}
