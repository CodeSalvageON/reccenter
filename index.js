// Server

const fs = require('fs');
const express = require('express');
const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null);

var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var io = require('socket.io')(http);

var port = process.env.PORT || 3000;
var mongodb_password = process.env.PWD;

const mongoose = require("mongoose");
const mongoose_uri = "mongodb+srv://69:" + mongodb_password + "@cluster0-nihiy.mongodb.net/plory?retryWrites=true&w=majority";

mongoose.connect(mongoose_uri, { useUnifiedTopology: true, useNewUrlParser: true });

const Schema = mongoose.Schema;
const connection = mongoose.connection;

connection.once("open", function (err) {
  if (err) {
    throw err;
  }

  else {
    console.log("MongoDB database connection established successfully");
  }
});

const pool = new Schema(
{
  message : {
    type : String
  }
},
{ collection : "Pool" }
);

console.log(pool);

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  const index = __dirname + '/public/static/index.html';

  res.sendFile(index);
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});