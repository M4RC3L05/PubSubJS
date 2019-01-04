import { isMyValidString, isValidAction } from './utils/assertions'
import { Action, UnsubAction } from './utils/types'

/**
 *
 * The PubSub IIFE
 *
 */
const PubSub = (function() {
    const topics: { [key: string]: Action<any>[] } = {}

    const _hasTopic = (topic: string) =>
        topics.hasOwnProperty(topic) && topics[topic] instanceof Array

    const _subToTopic = (topic: string, cb: Action<any>) =>
        topics[topic].push(cb)

    const _notify = (topic: string, data: any, sync: boolean = false) =>
        sync
            ? topics[topic].forEach(subs => subs.call(null, data))
            : setTimeout(() => {
                  if (!_hasTopic(topic)) return
                  topics[topic].forEach(subs => subs.call(null, data))
              }, 0)

    const _unsubAll = (topic: string = '') => {
        if (topic) delete topics[topic]
        else for (const topic in topics) delete topics[topic]
    }

    /**
     * Subscribes to a given topic
     * @function
     * @alias subscribe
     * @param { String } topic The topic to listen on
     * @param { Action<any> } cb The actions to be called when publish on subscribed topic
     * @return { UnsubAction } The unsub action
     */
    const subscribe = (topic: string, cb: Action<any>): UnsubAction => {
        if (!isMyValidString(topic)) throw Error('Topic has to be a string.')
        if (!isValidAction(cb)) throw Error('Action has to be a function.')
        if (!_hasTopic(topic)) topics[topic] = []

        _subToTopic(topic, cb)

        return () => {
            const index = topics[topic].indexOf(cb)
            topics[topic].splice(index, 1)
        }
    }

    /**
     * Publishes to a given topic
     * @function
     * @alias publish
     * @param { String } topic The topic to publish
     * @param { any } data The data to be published
     * @param { Boolean } sync Indicates if wheather the publish should be asyncronous
     * @return { void }
     */
    const publish = (topic: string, data: any, sync: boolean = false): void => {
        if (!isMyValidString(topic)) throw Error('Topic has to be a string.')
        if (!_hasTopic(topic)) return

        _notify(topic, data, sync)
    }

    /**
     * Clear all existing subscriptions
     * @function
     * @alias clearAllSubscriptions
     * @return { void }
     */
    const clearAllSubscriptions = (): void => _unsubAll()

    /**
     * Clear all existing subscriptions on a given topic
     * @function
     * @alias clearAllByTopic
     * @param { String } topic The topic to remove all subscriptions
     * @return { void }
     */
    const clearAllByTopic = (topic: string): void => {
        if (!isMyValidString(topic)) throw Error('Topic has to be a string.')
        if (!_hasTopic(topic)) return

        _unsubAll(topic)
    }

    /**
     * Gets all topics
     * @function
     * @alias getTopics
     * @return { String[] } The list of topics
     */
    const getTopics = (): string[] => Object.keys(topics)

    return {
        subscribe,
        publish,
        clearAllSubscriptions,
        clearAllByTopic,
        getTopics
    }
})()

export default PubSub
