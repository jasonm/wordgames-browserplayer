import React from 'react/addons';
import _ from 'lodash';
// import Router from 'react-router';
// import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
// import LoginHandler from './components/Login.js';
// require("css-loader");

let socket = io();

// View
import { Game } from './components/Game.jsx';
let game = React.render(<Game />, document.body);

// Processing
import getUpdateForEvent from './events.js';

function applyEventUpdate(event) {
  const stateUpdate = getUpdateForEvent(event, game.state);
  game.setState(stateUpdate);
}

// Networking
socket.on("event", function(event) {
  console.log("Event from server:", event);
  applyEventUpdate(event);
});

function handleLocalEvent(event) {
  console.log("Client handleLocalEvent just deferring to server", event);
  socket.emit("event", event);
}

// Local Input
import { KeyboardController } from './controllers.js';
new KeyboardController({ playerId: 'player1', eventListener: handleLocalEvent });
