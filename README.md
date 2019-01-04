# PubSubJS

[![Build Status](https://travis-ci.org/M4RC3L05/PubSubJS.svg?branch=master)](https://travis-ci.org/M4RC3L05/PubSubJS)

Simple pubsub solution for node and web

## Use

-   CDN
    -   Production
        ```html
        <script src="https://unpkg.com/pubsubjs-m4r/dist/umd/pubsubjs.prod.js"></script>
        ```
    -   Development
        ```html
        <script src="https://unpkg.com/pubsubjs-m4r/dist/umd/pubsubjs.dev.js"></script>
        ```
-   npm

    ```bash
    npm i -S pubsubjs-m4r
    ```

-   yarn
    ```bash
    yarn add pubsubjs-m4r
    ```

## How to use

```javascript
import PubSubJS from 'pubsubjs-m4r'
// Or
// const PubSubJS = require("pubsubjs-m4r").default

// Subscribe to topic "abc"
const sub = PubSubJS.subscribe('abc', data => {
    // Your code
    console.log(data)
})

// Publish to topic "acb"
PubSubJS.publish('abc', 'Hello')

// unsub!!
sub()
```

## API

-   PubSubJS

    -   Subscribe - subscribe to notifications on a given topic

    ```typescript
    subscribe: (topic: string, cb: Action<any>) => UnsubAction
    ```

    -   Publish - publishes to a given topic

    ```typescript
    publish: (topic: string, data: any, sync?: boolean) => void;

    ```

    -   ClearAllSubscriptions - removes all subscriptions

    ```typescript
    clearAllSubscriptions: () => void;

    ```


    - ClearAllByTopic  - removes all subscriptios on a topic
    ```typescript
    clearAllByTopic: (topic: string) => void;

    ```

    - GetTopics -  get the registered topics
    ```typescript
    getTopics: () => string[];
    ```
