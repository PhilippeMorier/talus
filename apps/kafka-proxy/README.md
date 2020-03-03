# kafka-proxy

Same idea as [Confluent REST proxy](https://docs.confluent.io/current/kafka-rest/) but using
WebSockets.

- https://docs.confluent.io/current/kafka-rest/
- https://github.com/tulios/kafkajs/issues/36#issuecomment-449953932

## Debug in WebStorm

- https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html#cc8ea8a7

Just run the application with `yarn nx serve kafka-proxy` and then attach WebStorm to it. Be sure to
use correct port (e.g. 7777).

> `Debugger listening on ws://localhost:7777/44ed7046-cad0-414c-b138-05e8a9ae7da3`
