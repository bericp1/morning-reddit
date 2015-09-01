var express = require('express'),
  Snoocore = require('snoocore'),
  config = require('./config');

var app = express();

var reddit = new Snoocore(config.snoocore);

var constructPost = function(data) {
  var post = '<div class="row"><div class="col-lg-8 col-lg-offset-2">';
  post += '<div class="well">';
  post += '<h2><a href="' + data.url + '">' + data.title + '</a><h2>';
  post += '<small><strong>' + data.subreddit + '</strong> &mdash; ';
  post += '<em>' + data.author + '</em></small> &mdash; ';
  post += '<a href="' + data.permalink + '">comments</a><br>';
  post += '</div></div></div>';
  return post;
};

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  var resp = '<html><head>';
  resp += '<title>Reddit for the Morning</title>';
  resp += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">';
  resp += '</head><body>';
  resp += '<div class="container">';
  resp += '<div class="row"><div class="col-lg-8 col-lg-offset-2">';
  resp += '<h1>Reddit for the Morning</h1>';
  resp += '</div></div>';
  reddit('/hot').get({limit: 20}).then(function(data) {
    data.data.children.forEach(function(post) {
      resp += constructPost(post.data);
    });
    resp += '</div></body></html>';
    res.send(resp);
  })
  .catch(function() {
    console.err('caught reddit error:', arguments);
    resp += '<div class="alert alert-danger">Something went wrong!</div>';
    resp += '</div></body></html>';
    res.send(resp);
  });
});

app.listen(config.port);
