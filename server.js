var express = require("express"),
    socketio = require("socket.io"),
    http = require("http");

var app = express(),
    server = http.Server(app),
    io = socketio(server),
    port = process.env.PORT || 8081;

app.use(express.static(__dirname + "/public"));

io.on("connection", function(socket) {
  socket.emit("event", { type: 'init' });
  socket.emit("event", { type: 'add-grid-row', row: ['c', 'a', 't', 'd', 'e', 'f', 'g'] });
  socket.emit("event", { type: 'add-grid-row', row: ['a', 'b', 'c', 'd', 'o', 'g', 'g'] });
  socket.emit("event", { type: 'add-grid-row', row: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] });
  socket.emit("event", { type: 'add-grid-row', row: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] });
  socket.emit("event", { type: 'add-grid-row', row: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] });
  socket.emit("event", { type: 'add-grid-row', row: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] });


  socket.on("event", function(event) {
    console.log("Server received event: ", event);

    // TODO: Why not broadcast?
    // socket.broadcast.emit("event", event);
    socket.emit("event", event);
  });
});

server.listen(port, function() {
  console.log("http://localhost:" + port + "/");
});

// let fs = require("fs");
// let seedWords = fs.readFileSync('../../gridmaker/norvig/spacey_1000.txt'),
//     GridMaker = require("gridmaker"),
//     gridMaker = new GridMaker({ width: 40, words: seedWords });
//
// gridMaker.ready(function() {
//   var grid = [];
//   for (var i = 0; i < 10; i++) {
//     grid.push(gridMaker.generateRow(grid));
//   }
// });
