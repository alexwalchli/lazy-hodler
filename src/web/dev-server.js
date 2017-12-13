var webpack = require('webpack');
var config = require('./webpack.config');
var express = require('express');
var app = new express();
var port = 3000;

app.use("/", express.static(__dirname + '/build-web'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/build-web/index.html');
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("Lazy Hodler is ==> 🌎, Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});