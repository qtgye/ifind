const WebSocket = require("ws");

const EVENTS = [
  'message',
  'close',
  'error',
  'ping',
  'pong',
];

class Controller {
  constructor(webSocketConnection) {
    if ( webSocketConnection instanceof WebSocket ) {
      this.connection = webSocketConnection;
    }
    else {
      throw new Error('Supplied connection must be a valid WebSocket instance.');
    }
  }

  init() {
    EVENTS.forEach(event => {
      const eventMethod = `on${event}`;

      if ( eventMethod in this ) {
        this.connection.addEventListener(event, (event) => {
          this[eventMethod](event);
        });
      }
    });

    if ( typeof this.onopen ) {
      this.onopen();
    }
  }

  // Events
  onmessage(message) {}
  onclose(message) {}
  onerror(message) {}
  onping(message) {}
  onpong(message) {}
  onopen(message) {}

  // Methods
  send(data) {
    // Stringify data as JSON
    const jsonString = JSON.stringify(data);
    this.connection.send(jsonString);
  }
}

module.exports = Controller;

