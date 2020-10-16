`io` is a Socket.IO server instance attached to an instance of `http.Server` listening for incoming events.

The `socket` argument of the `connection` event listener callback function is an object that represents an incoming socket connection from a client.

- The `io` variable represents the group of sockets.
- The `socket` variable is only for communicating with each individual connection.

## [Everything You Need To Know About Socket.IO](https://www.ably.io/topic/socketio)
Socket.IO brings to mind WebSockets. WebSockets are also a browser implementation allowing bi-directional communication, however, Socket.IO does not use this as standard. First, Socket.IO creates a long-polling connection using xhr-polling. Then, once this is established, it upgrades to the best connection method available. In most cases, this will result in a WebSocket connection. See how [WebSockets fare against long-polling](https://www.ably.io/blog/websockets-vs-long-polling/) (and why WebSockets are nearly always the better choice), here on the [Ably blog](https://www.ably.io/blog/). A [full overview of WebSockets, their history, how they work and use case, is available to read here](https://www.ably.io/topic/websockets).