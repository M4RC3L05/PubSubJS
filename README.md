# PubSubJS

Simple pubsub solution for node and web

## Use

-   CDN
    -   Production
        ```html
        <script src="https://unpkg.com/pubsubjs-m4r@0.1.7/umd/pubsubjs.prod.js"></script>
        ```
    -   Development
        ```html
        <script src="https://unpkg.com/pubsubjs-m4r@0.1.7/umd/pubsubjs.dev.js"></script>
        ```
-   npm

    ```bash
    npm i -s pubsubjs-m4r
    ```

-   yarn
    ```bash
    yarn add pubsubjs-m4r
    ```

## How to use

```javascript
import PubSubJS from 'pubsubjs-m4r'

// Subscribe to topic "abc"
PubSubJS.subscribe('abc', data => {
    // Your code
    console.log(data)
})

// Publish to topic "acb"
PubSubJS.publish('abc', 'Hello')
```

## API

-   PubSubJS

    -   Subscribe - subscribe to notifications on a given topic

    ```typescript
    subscribe: (topic: string, cb: Action<any>) => number
    ```

    -   Unsubscribe - usubscribe from a given topic

    ```typescript
    unsubscribe: (topic: string, id: number) => void;

    ```

    -   Publish - publisshes to a given topic

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
