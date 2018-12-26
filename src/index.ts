type Action<T> = (a: T) => void

const PubSub = (function() {
    const topics: { [key: string]: Action<any>[] } = {}

    const _hasTopic = (topic: string) =>
        topics.hasOwnProperty(topic) && topics[topic] instanceof Array
    const _subToTopic = (topic: string, cb: Action<any>) =>
        topics[topic].push(cb) - 1
    const _unsubFromTopic = (topic: string, id: number) =>
        topics[topic].splice(id, 1)
    const _notify = (topic: string, data: any, sync: boolean = false) =>
        sync
            ? topics[topic].forEach(cb => cb.call(null, data))
            : setTimeout(() => {
                  if (!_hasTopic(topic)) return
                  topics[topic].forEach(cb => cb.call(null, data))
              }, 0)

    const _unsubAll = (topic: string = '') => {
        if (topic)
            if (_hasTopic(topic)) delete topics[topic]
            else return
        else for (const topic in topics) delete topics[topic]
    }

    const subscribe = (topic: string, cb: Action<any>) => {
        if (!_hasTopic(topic)) topics[topic] = []

        return _subToTopic(topic, cb)
    }

    const unsubscribe = (topic: string, id: number) => {
        if (!_hasTopic(topic)) return

        _unsubFromTopic(topic, id)
    }

    const publish = (topic: string, data: any, sync: boolean = false) => {
        if (!_hasTopic(topic)) return

        _notify(topic, data, sync)
    }

    const clearAllSubscriptions = () => _unsubAll()

    const clearAllByTopic = (topic: string) => _unsubAll(topic)

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
