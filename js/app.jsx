import React from 'react/addons';
import _ from 'lodash';
// import Router from 'react-router';
// import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
// import LoginHandler from './components/Login.js';

// require("css-loader");

const Row = React.createClass({
  render() {
    let body = _.map(this.props.row, (col) => <span className="cell">{ col }</span>);
    return <section className="row">{ body }</section>;
  }
});

const Player = React.createClass({
  render() {
    let divStyle = {
      top: `${this.props.player.position[0] * 40}px`,
      left: `${this.props.player.position[1] * 40}px`,
      outlineColor: this.props.player.color
    };

    return (
      <div className="player" style={ divStyle }></div>
    );
  }
});

const PlayerSelection = React.createClass({
  render() {
    const playerSelectionMarkers = _.map(this.props.player.selection, (position, selectionIndex) => {
      const divStyle = {
        top: `${position[0] * 40}px`,
        left: `${position[1] * 40}px`,
        outlineColor: this.props.player.color
      };
      return (
        <div className="playerSelectionMarker" style={ divStyle }>{ selectionIndex + 1}</div>
      );
    });

    return (
      <div className="playerSelection">
        { playerSelectionMarkers }
      </div>
    );
  }
});

const Score = React.createClass({
  render() {
    const words = _.map(this.props.player.words, (word) => {
      return (<p>{ word }</p>);
    });

    return (
      <section>
        <strong>{ this.props.player.name }</strong>
        { words }
      </section>
    );
  }
});

const Board = React.createClass({
  render() {

    const cells = _.map(this.props.grid, (row) => <Row row={row} />),
          playerSelections = _.map(this.props.players, (player) => <PlayerSelection player={ player } />),
          players = _.map(this.props.players, (player) => <Player player={ player } />),
          scoreboard = _.map(this.props.players, (player) => <Score player={ player } />);

    return (
      <div className="board">
        { cells }
        { playerSelections }
        { players }
        { scoreboard }
      </div>
    );
  }
});

const Game = React.createClass({
  getInitialState() {
    return { grid: [[]], players: [] };
  },

  render() {
    return (
      <Board grid={ this.state.grid } players={ this.state.players } />
    );
  }
});


let grid = [
  ['c', 'a', 't', 'd', 'e', 'f', 'g'],
  ['a', 'b', 'c', 'd', 'o', 'g', 'g'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
];

let game = React.render(<Game />, document.body);

game.setState({
  grid: grid,
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

function processEvent(event) {
  function update(patch) {
    game.setState(React.addons.update(game.state, patch));
  }

  if (event.type === 'move') {
    const [rowOffset, colOffset] = {
      'up':    [-1,  0],
      'down':  [ 1,  0],
      'left':  [ 0, -1],
      'right': [ 0,  1],
    }[event.direction];

    const currentPosition = game.state.players[event.playerId].position,
          newPosition = [
            currentPosition[0] + rowOffset,
            currentPosition[1] + colOffset
          ],
          newPositionOnGrid = (newPosition[0] >= 0) &&
                              (newPosition[1] >= 0) &&
                              (game.state.grid.length > newPosition[0]) &&
                              (game.state.grid[0].length > newPosition[1]);

    if (newPositionOnGrid) {
      update({
        players: {
          [event.playerId]: {
            position: {
              $set: newPosition
            }
          }
        }
      });
    }
  }

  function isAdjacent(position1, position2) {
    return Math.abs(position1[0] - position2[0]) <= 1 &&
           Math.abs(position1[1] - position2[1]) <= 1;
  }

  function containsPosition(selection, position) {
    return _.any(selection, _.partial(_.isEqual, position));
  }

  if (event.type === 'toggle') {
    const currentSelection = game.state.players[event.playerId].selection,
          currentPosition = game.state.players[event.playerId].position,
          lastPosition = _.last(currentSelection);

    let newSelection = undefined;

    if (lastPosition === undefined) {
      newSelection = [currentPosition];
    } else if (_.isEqual(lastPosition, currentPosition)) {
      newSelection = currentSelection.slice(0, currentSelection.length - 1);
    } else if (containsPosition(currentSelection, currentPosition)) {
      console.log("intersect!");
      return;
    } else if (isAdjacent(lastPosition, currentPosition)) {
      newSelection = currentSelection;
      newSelection.push(currentPosition);
    } else {
      newSelection = currentSelection;
    }

    update({
      players: {
        [event.playerId]: {
          selection: {
            $set: newSelection
          }
        }
      }
    });
  }

  if (event.type === 'submit') {
    const word = _.map(game.state.players[event.playerId].selection, (position) => {
      return game.state.grid[position[0]][position[1]];
    }).join("");

    const currentWords = game.state.players[event.playerId].words;

    let newWords = currentWords;
    newWords.push(word);

    update({
      players: {
        [event.playerId]: {
          selection: { $set: [] },
          words: { $set: newWords }
        }
      }
    });
  }
}

class KeyboardController {
  constructor(options) {
    this.playerId = options.playerId;
    this.processEvent = options.processEvent;
    window.document.addEventListener("keydown", this.handleKeyDown.bind(this), false);
  }

  handleKeyDown(e) {
    const keyEvents = {
      13: { type: 'submit' },
      32: { type: 'toggle' },
      37: { type: 'move', direction: 'left' },
      38: { type: 'move', direction: 'up' },
      39: { type: 'move', direction: 'right' },
      40: { type: 'move', direction: 'down' },
    };

    if (keyEvents[e.keyCode]) {
      const event = _.extend(keyEvents[e.keyCode], {
        playerId: this.playerId
      });

      this.processEvent(event);
    }
  }
}

new KeyboardController({ playerId: 'player1', processEvent: processEvent });
