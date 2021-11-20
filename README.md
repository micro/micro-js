# Micro JS Client

The JS client for the Micro Platform.

View on [NPM](https://www.npmjs.com/package/micro-js-client)

## Usage

Installation:
```
npm install --save micro-js-client
```

## Request

Make a standard http request

```js
const micro = require('micro-js-client');

new micro.Client({ token: 'MICRO_API_TOKEN' })
  .call('helloworld', 'call', {"name": "John"})
  .then((response) => {
    console.log(response);
  });
```

The output will be:
```
{ message: 'Hello John' }
```

## Streaming

Make a websocket streaming request

```js
const micro = require("micro-js-client")

new micro.Client({ token: 'MICRO_API_TOKEN' })
  .stream("helloworld", "stream", {"name": "John", "messages": 10})
  .then(stream => {
	stream.recv(msg => {
		console.log("message received: ", msg)
	})
}).catch(e => {
	console.log(e)
})

setInterval(() => {}, 5000);

```

Above example will output:

```
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
```
