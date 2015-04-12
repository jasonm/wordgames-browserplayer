import React from 'react/addons';
import _ from 'lodash';
// import Router from 'react-router';
// import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
// import LoginHandler from './components/Login.js';
// require("css-loader");


// View
import { Game } from './components/Game.jsx';
let game = React.render(<Game />, document.body);

// Processing
import getUpdateForEvent from './events.js';

function processEvent(event) {
  let stateUpdate = getUpdateForEvent(event, game.state);
  game.setState(stateUpdate);
}

// Input
import { KeyboardController } from './controllers.js';
new KeyboardController({ playerId: 'player1', processEvent: processEvent });

// Initial state
game.setState({
  grid: [],
  players: {
    'player1': {
      name: "P1",
      color: "#339933",
      position: [0, 0],
      selection: [],
      words: []
    }
  }
});
processEvent({ type: 'add-grid-row', row: ['c', 'a', 't', 'd', 'e', 'f', 'g'] });
processEvent({ type: 'add-grid-row', row: ['a', 'b', 'c', 'd', 'o', 'g', 'g'] });
processEvent({ type: 'add-grid-row', row: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] });
processEvent({ type: 'add-grid-row', row: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] });
processEvent({ type: 'add-grid-row', row: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] });
processEvent({ type: 'add-grid-row', row: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] });

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
