import { isMyValidString, isValidAction } from './utils/assertions'
import { ISubscription, Action } from './utils/types'
import uuid from 'uuid'

/**
 * The type of subscriptions actions
 *
 */
const PubSub = (function() {
    const topics: { [key: string]: ISubscription[] } = {}

    const _hasTopic = (topic: string) =>
        topics.hasOwnProperty(topic) && topics[topic] instanceof Array

    const _subToTopic = (topic: string, cb: Action<any>) => {
        const id = uuid.v4()
        topics[topic].push({ id, action: cb })
        return id
    }

    const _unsubFromTopic = (topic: string, id: string) =>
        (topics[topic] = topics[topic].filter(subs => subs.id !== id))

    const _notify = (topic: string, data: any, sync: boolean = false) =>
        sync
            ? topics[topic].forEach(subs => subs.action.call(null, data))
            : setTimeout(() => {
                  if (!_hasTopic(topic)) return
                  topics[topic].forEach(subs => subs.action.call(null, data))
              }, 0)

    const _unsubAll = (topic: string = '') => {
        if (topic) return delete topics[topic]
        else for (const topic in topics) delete topics[topic]
    }

    /**
     * Subscribes to a given topic
     * @function
     * @alias subscribe
     * @param { String } topic The topic to listen on
     * @param { Action<any> } cb The actions to be called when publish on subscribed topic
     * @return { Number } The sub id
     */
    const subscribe = (topic: string, cb: Action<any>) => {
        if (!isMyValidString(topic)) throw Error('Topic has to be a string.')
        if (!isValidAction(cb)) throw Error('Action has to be a function.')
        if (!_hasTopic(topic)) topics[topic] = []

        return _subToTopic(topic, cb)
    }

    /**
     * Unsubscribes to a given topic
     * @function
     * @alias unsubscribe
     * @param { String } topic The topic to unsubscribe
     * @param { String } id The sub id
     * @return {}
     */
    const unsubscribe = (topic: string, id: string) => {
        if (!isMyValidString(topic)) throw Error('Topic has to be a string.')
        if (!isMyValidString(id)) throw Error('ID has to be a string.')
        if (!_hasTopic(topic)) return

        _unsubFromTopic(topic, id)
    }

    /**
     * Publishes to a given topic
     * @function
     * @alias publish
     * @param { String } topic The topic to publish
     * @param {} data The data to be published
     * @param { Boolean } sync Indicates if wheather the publish should be asyncronous
     * @return {}
     */
    const publish = (topic: string, data: any, sync: boolean = false) => {
        if (!isMyValidString(topic)) throw Error('Topic has to be a string.')
        if (!_hasTopic(topic)) return

        _notify(topic, data, sync)
    }

    /**
     * Clear all existing subscriptions
     * @function
     * @alias clearAllSubscriptions
     * @return {}
     */
    const clearAllSubscriptions = () => _unsubAll()

    /**
     * Clear all existing subscriptions on a given topic
     * @function
     * @alias clearAllSubscriptions
     * @param { String } topic The topic to remove all subscriptions
     * @return {}
     */
    const clearAllByTopic = (topic: string) => {
        if (!isMyValidString(topic)) throw Error('Topic has to be a string.')
        if (!_hasTopic(topic)) return

        _unsubAll(topic)
    }

    /**
     * Gets all topics
     * @function
     * @alias clearAllSubscriptions
     * @return { String[] } The list of topics
     */
    const getTopics = () => Object.keys(topics)

    return {
        subscribe,
        unsubscribe,
        publish,
        clearAllSubscriptions,
        clearAllByTopic,
        getTopics
    }
})()

export default PubSub
