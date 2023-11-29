const crypto = require('crypto');
const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3000;

const server = createServer(app);
const wss = new WebSocket.Server({ server });
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
const clients = new Set();
let timestamp = 0;
wss.on('connection', function(ws) {
  console.log("client joined.");

  clients.add(ws);
  // send "hello world" interval
  //const textInterval = setInterval(() => ws.send("hello world!"), 100);

  // send random bytes interval
  //const binaryInterval = setInterval(() => ws.send(crypto.randomBytes(8).buffer), 110);

  ws.on('message', function(data) {
    if (typeof(data) === "string") {
      // client sent a string
     

// timestamp in milliseconds
      console.log(Date.now()-timestamp);
      console.log("string received from client -> at "+ Date.now() + data + "\n");
      timestamp = Date.now();

    } 
    else {
      console.log("binary received from client -> " + Array.from(data).join(", ") + "");
    }

    broadcastMessage(ws,data);

  });

  ws.on('close', function() {
    console.log("client left.");
    //clearInterval(textInterval);
    //clearInterval(binaryInterval);
    clients.delete(ws);
  });
});

function broadcastMessage(sender, message) {
  clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.listen(port, function() {
  console.log(`Listening on http://localhost:${port}`);
});
