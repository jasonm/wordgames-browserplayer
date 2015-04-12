import React from 'react/addons';
import _ from 'lodash';

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
    return { grid: [], players: [] };
  },

  render() {
    return (
      <Board grid={ this.state.grid } players={ this.state.players } />
    );
  }
});


export { Game };
