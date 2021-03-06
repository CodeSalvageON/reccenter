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
var sanitizer = require('sanitizer');

var port = process.env.PORT || 3000;
var mongodb_password = process.env.PWD;

const secret_key = __dirname + '/secret/powersource-c5e07ba477f9.json';

const admin = require('firebase-admin');
const serviceAccount = require(secret_key);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  const index = __dirname + '/public/static/index.html';

  res.sendFile(index);
});

app.post("/push_message", async function (req, res) {
  const message = req.body.message;
  const clean_message = DOMPurify.sanitize(message);

  const poolRef = db.collection('pool').doc('chatlog');
  const doc = await poolRef.get();

  console.log(doc.data().log);

  if (!doc.exists) {
    console.log("Error: Document not found");
  }

  else {
    console.log(doc.data());
  }

  await poolRef.set({
    log : doc.data().log + "<br/><div class='message'><h3>" + sanitizer.escape(message) + "</h3></div><script src='https://reccenter.codesalvageon.repl.co/scripts/pool/scroller.js'></script>"
  });
});

app.get("/get_messages", async function (req, res) {
  const poolRef = db.collection('pool').doc('chatlog');
  const doc = await poolRef.get();

  const messages = doc.data().log;

  res.send(messages);
});

app.post("/push_shit", async function (req, res) {
  const message = req.body.message;

  const bathroomRef = db.collection('bathroom').doc('chatlog');
  const doc = await bathroomRef.get();

  console.log(doc.data().log);

  if (!doc.exists) {
    console.log("Error: Document not found");
  }

  else {
    console.log(doc.data());
  }

  await bathroomRef.set({
    log : doc.data().log + "<br/><div class='message'><h3>" + sanitizer.escape(message) + "</h3></div><script src='https://reccenter.codesalvageon.repl.co/scripts/pool/scroller.js'></script>"
  });
});

app.get("/get_shit", async function (req, res) {
  const bathroomRef = db.collection('bathroom').doc('chatlog');
  const doc = await bathroomRef.get(); 

  const messages = doc.data().log;

  res.send(messages);
});

http.listen(port, function(){
  console.log('listening on *:' + port);

  const poolRef = db.collection('pool').doc('chatlog');
  const bathroomRef = db.collection('bathroom').doc('chatlog');
  
  async function fixPool () {
    const doc = await poolRef.get();
    const shit = await bathroomRef.get();

    if (!doc.exists) {
      const fix_data = {
        log : "<link href='https://reccenter.codesalvageon.repl.co/styles/pool/pool.css' rel='stylesheet'><script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script><script src='https://reccenter.codesalvageon.repl.co/scripts/pool/scroller.js'></script>"
      }

      await poolRef.set(fix_data);
    }

    else {
      console.log("No fix needed.");
    }

    if (!shit.exists) {
      const fix_data = {
        log : "<link href='https://reccenter.codesalvageon.repl.co/styles/pool/pool.css' rel='stylesheet'><script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script><script src='https://reccenter.codesalvageon.repl.co/scripts/pool/scroller.js'></script>"
      }

      await bathroomRef.set(fix_data);
    }

    else {
      console.log("No fix needed.");
    }
  }

  fixPool();
});