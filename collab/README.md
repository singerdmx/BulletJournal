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
```

### Local Development

Please follow the steps below:

(1) Intall nginx locally. For mac, run `brew install nginx`.

(2) Replace [absolution path to <repo root>/frontend] in nginx.conf.

(3) Run `nginx -c <absolute path to this nginx.conf file>`.

For example: 

```bash
nginx -c "$PWD/nginx.conf"
```

(4) Open the browser and enter `http://localhost/collab/?uid=12345678` to see the UI interface.
`uid` here is the parameter passed to our service.


(5) Run `nginx -s stop` to stop nginx when you are done.
