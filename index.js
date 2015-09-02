var express = require('express'),
  Snoocore = require('snoocore'),
  when = require('when'),
  he = require('he'),

  config = require('./config');

var app = express();

var reddit = new Snoocore(config.snoocore);

var getTopComment = function(post) {
  return reddit('/comments/' + post.data.id)
    .get({context:0,limit:1,depth:0,sort:'top'})
    .then(function(comment) {
      comment = comment[1].data.children;
      post.data.top_comment = (comment.length && typeof comment[0].data.body_html === 'string') ?
        he.decode(comment[0].data.body_html) :
        '<em>No comments</em>';
      return post;
    });
};

var constructPost = function(data) {
  data = data.data;
  var post = '<div class="row"><div class="col-lg-8 col-lg-offset-2">';
  post += '<div class="well">';
  post += '<h4>';
  if(!data.is_self) post += '<a href="' + data.url + '">';
  post += data.title;
  if(!data.is_self) post += '</a>';
  post += '</h4>';
  post += '<small><strong>' + data.subreddit + '</strong> &mdash; ';
  post += '<em>' + data.author + '</em></small><br><br>';
  if(typeof data.selftext_html === 'string' && data.selftext_html)
    post += '<p>' + data.selftext_html + '</p>';
  post += '<div class="panel panel-primary"><div class="panel-heading">';
  post += '<h3 class="panel-title">Top Comment</h3>';
  post += '</div><div class="panel-body">';
  post += data.top_comment;
  post += '</div></div>';
  post += '</div></div></div>';
  return post;
};

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  var resp = '<html><head>';
  resp += '<title>Reddit for the Morning (m/NewsMonster)</title>';
  resp += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">';
  resp += '<meta charset="utf-8">';
  resp += '<meta http-equiv="X-UA-Compatible" content="IE=edge">';
  resp += '<meta name="viewport" content="width=device-width, initial-scale=1">';
  resp += '</head><body>';
  resp += '<div class="container">';
  resp += '<div class="row"><div class="col-lg-8 col-lg-offset-2">';
  resp += '<h1>Reddit for the Morning (m/NewsMonster)</h1>';
  resp += '</div></div>';
  reddit('/user/SharpHawkeye/m/newsmonster')
    .get({limit: 10})
    .then(function(data) {
      return when.map(data.data.children, getTopComment);
    })
    .then(function(posts){
      return when.map(posts, constructPost);
    })
    .then(function(posts) {
      resp += posts.join('');
    })
    .catch(function(error) {
      resp += '<div class="row"><div class="col-lg-8 col-lg-offset-2">';
      resp += '<div class="alert alert-danger">Something went wrong!</div>';
      resp += '</div></div>';
      throw error;
    })
    .finally(function() {
      resp += '</div></body></html>';
      res.send(resp);
    });
});

app.listen(config.port);
