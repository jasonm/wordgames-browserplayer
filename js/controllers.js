class KeyboardController {
  constructor(options) {
    this.playerId = options.playerId;
    this.eventListener = options.eventListener;
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

      this.eventListener(event);
    }
  }
}

export { KeyboardController };
