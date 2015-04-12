import React from 'react/addons';

export default function getUpdateForEvent(event, state) {
  console.log("Processing event", JSON.stringify(event));

  function update(patch) {
    return React.addons.update(state, patch);
  }

  if (event.type === 'add-grid-row') {
    return update({
      grid: { $push: [event.row] }
    });
  }

  if (event.type === 'move') {
    const [rowOffset, colOffset] = {
      'up':    [-1,  0],
      'down':  [ 1,  0],
      'left':  [ 0, -1],
      'right': [ 0,  1],
    }[event.direction];

    const currentPosition = state.players[event.playerId].position,
          newPosition = [
            currentPosition[0] + rowOffset,
            currentPosition[1] + colOffset
          ],
          newPositionOnGrid = (newPosition[0] >= 0) &&
                              (newPosition[1] >= 0) &&
                              (state.grid.length > newPosition[0]) &&
                              (state.grid[0].length > newPosition[1]);
    if (newPositionOnGrid) {
      return update({
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
    const currentSelection = state.players[event.playerId].selection,
          currentPosition = state.players[event.playerId].position,
          lastPosition = _.last(currentSelection);

    let newSelection = undefined;

    if (lastPosition === undefined) {
      newSelection = [currentPosition];
    } else if (_.isEqual(lastPosition, currentPosition)) {
      newSelection = currentSelection.slice(0, currentSelection.length - 1);
    } else if (containsPosition(currentSelection, currentPosition)) {
      return;
    } else if (isAdjacent(lastPosition, currentPosition)) {
      newSelection = currentSelection;
      newSelection.push(currentPosition);
    } else {
      newSelection = currentSelection;
    }

    return update({
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
    const word = _.map(state.players[event.playerId].selection, (position) => {
      return state.grid[position[0]][position[1]];
    }).join("");

    const currentWords = state.players[event.playerId].words;

    let newWords = currentWords;
    newWords.push(word);

    return update({
      players: {
        [event.playerId]: {
          selection: { $set: [] },
          words: { $set: newWords }
        }
      }
    });
  }
}

