import PubSubJS from '../../'

describe('PubSubJS tests', () => {
    beforeEach(() => {
        PubSubJS.clearAllSubscriptions()
    })

    it('Should only work with corrent arg types', () => {
        // SUBSCRIBE
        expect(() => PubSubJS.subscribe([] as any, [] as any)).toThrow()
        expect(() => PubSubJS.subscribe([] as any, () => {})).toThrow()
        expect(() => PubSubJS.subscribe('a', [] as any)).toThrow()
        expect(() => PubSubJS.subscribe('a', () => {})).not.toThrow()

        // PUBLISH
        expect(() => PubSubJS.publish([] as any, 'dsfd')).toThrow()
        expect(() => PubSubJS.publish('sss', 'dsfd')).not.toThrow()

        // UNSUBSCRIBE
        expect(() => PubSubJS.unsubscribe([] as any, [] as any)).toThrow()
        expect(() => PubSubJS.unsubscribe('aaa', [] as any)).toThrow()
        expect(() => PubSubJS.unsubscribe([] as any, '1')).toThrow()
        expect(() => PubSubJS.unsubscribe('aaa', '1')).not.toThrow()

        // CLEARALLBYTOPIC
        expect(() => PubSubJS.clearAllByTopic([] as any)).toThrow()
        expect(() => PubSubJS.clearAllByTopic('df')).not.toThrow()
    })

    it('Should subscribe and be notified [ASYNC]', () => {
        jest.useFakeTimers()

        const mock = jest.fn()
        PubSubJS.subscribe('a', mock)
        PubSubJS.subscribe('a', mock)

        PubSubJS.publish('a', 'a')
        PubSubJS.publish('a', 'a')
        expect(mock).not.toBeCalled
        jest.runAllTimers()

        expect(mock).toHaveBeenCalled()
        expect(mock).toHaveBeenCalledTimes(4)
        expect(mock).toHaveBeenCalledWith('a')
    })

    it('Should subscribe and be notified [SYNC]', () => {
        const mock = jest.fn()
        PubSubJS.subscribe('a', mock)
        PubSubJS.subscribe('a', mock)
        PubSubJS.publish('a', 'b', true)
        PubSubJS.publish('a', 'b', true)

        expect(mock).toHaveBeenCalled()
        expect(mock).toHaveBeenCalledTimes(4)
        expect(mock).toHaveBeenCalledWith('b')
    })

    it('Should get all topics', () => {
        expect(PubSubJS.getTopics()).toHaveLength(0)

        PubSubJS.subscribe('a', () => {})
        PubSubJS.subscribe('a', () => {})
        PubSubJS.subscribe('b', () => {})

        expect(PubSubJS.getTopics()).toHaveLength(2)
        expect(PubSubJS.getTopics()).toContain('a')
        expect(PubSubJS.getTopics()).toContain('b')
    })

    it('Should clear all subscriber from given topic', () => {
        const mock1 = jest.fn()
        const mock2 = jest.fn()

        PubSubJS.subscribe('a', mock1)
        PubSubJS.subscribe('b', mock2)

        PubSubJS.publish('a', 'a', true)
        expect(mock1).toHaveBeenCalled()
        expect(mock1).toHaveBeenCalledTimes(1)
        expect(mock1).toHaveBeenCalledWith('a')

        PubSubJS.publish('b', 'b', true)
        expect(mock2).toHaveBeenCalled()
        expect(mock2).toHaveBeenCalledTimes(1)
        expect(mock2).toHaveBeenCalledWith('b')

        PubSubJS.clearAllByTopic('a')
        PubSubJS.publish('a', 'a', true)
        expect(mock1).toHaveBeenCalled()
        expect(mock1).toHaveBeenCalledTimes(1)
        expect(mock1).toHaveBeenCalledWith('a')
        PubSubJS.publish('b', 'b', true)
        expect(mock2).toHaveBeenCalled()
        expect(mock2).toHaveBeenCalledTimes(2)
        expect(mock2).toHaveBeenCalledWith('b')
        expect(PubSubJS.getTopics()).toHaveLength(1)
    })

    it('Should clear all subscriber', () => {
        const mock1 = jest.fn()
        const mock2 = jest.fn()

        PubSubJS.subscribe('a', mock1)
        PubSubJS.subscribe('b', mock2)

        PubSubJS.publish('a', 'a', true)
        expect(mock1).toHaveBeenCalled()
        expect(mock1).toHaveBeenCalledTimes(1)
        expect(mock1).toHaveBeenCalledWith('a')

        PubSubJS.publish('b', 'b', true)
        expect(mock2).toHaveBeenCalled()
        expect(mock2).toHaveBeenCalledTimes(1)
        expect(mock2).toHaveBeenCalledWith('b')

        PubSubJS.clearAllSubscriptions()
        PubSubJS.publish('a', 'a', true)
        expect(mock1).toHaveBeenCalled()
        expect(mock1).toHaveBeenCalledTimes(1)
        expect(mock1).toHaveBeenCalledWith('a')
        PubSubJS.publish('b', 'b', true)
        expect(mock2).toHaveBeenCalled()
        expect(mock2).toHaveBeenCalledTimes(1)
        expect(mock2).toHaveBeenCalledWith('b')
        expect(PubSubJS.getTopics()).toHaveLength(0)
    })

    it('Should remove subscription', () => {
        const mock1 = jest.fn()
        const mock2 = jest.fn()
        const mock3 = jest.fn()

        const mock1id = PubSubJS.subscribe('a', mock1)
        const mock2id = PubSubJS.subscribe('a', mock2)
        const mock3id = PubSubJS.subscribe('a', mock3)

        PubSubJS.publish('a', 'a', true)
        expect(mock1).toHaveBeenCalledTimes(1)
        expect(mock2).toHaveBeenCalledTimes(1)
        expect(mock3).toHaveBeenCalledTimes(1)

        PubSubJS.unsubscribe('a', mock1id)
        PubSubJS.publish('a', 'a', true)
        expect(mock1).toHaveBeenCalledTimes(1)
        expect(mock2).toHaveBeenCalledTimes(2)
        expect(mock3).toHaveBeenCalledTimes(2)

        PubSubJS.unsubscribe('a', mock3id)
        PubSubJS.publish('a', 'a', true)
        expect(mock1).toHaveBeenCalledTimes(1)
        expect(mock2).toHaveBeenCalledTimes(3)
        expect(mock3).toHaveBeenCalledTimes(2)

        PubSubJS.unsubscribe('a', mock2id)
        PubSubJS.publish('a', 'a', true)
        expect(mock1).toHaveBeenCalledTimes(1)
        expect(mock2).toHaveBeenCalledTimes(3)
        expect(mock3).toHaveBeenCalledTimes(2)
    })
})
