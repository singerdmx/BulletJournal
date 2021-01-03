## Setup

### Install

```sh
npm install
```

### Signaling

The peers find each other by connecting to a signaling server. This package implements a small signaling server in `./server.js`.

```sh
# start signaling server
PORT=4444 node ./server.js
``
