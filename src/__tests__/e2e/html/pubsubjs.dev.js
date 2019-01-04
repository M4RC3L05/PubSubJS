(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.PubSubJS = factory());
}(this, function () { 'use strict';

    var isMyValidString = function (topic) {
        return typeof topic === 'string' || topic instanceof String;
    };
    var isValidAction = function (cb) {
        return typeof cb === 'function' || cb instanceof Function;
    };

    /**
     *
     * The PubSub IIFE
     *
     */
    var PubSub = (function () {
        var topics = {};
        var _hasTopic = function (topic) {
            return topics.hasOwnProperty(topic) && topics[topic] instanceof Array;
        };
        var _subToTopic = function (topic, cb) {
            return topics[topic].push(cb);
        };
        var _notify = function (topic, data, sync) {
            if (sync === void 0) { sync = false; }
            return sync
                ? topics[topic].forEach(function (subs) { return subs.call(null, data); })
                : setTimeout(function () {
                    if (!_hasTopic(topic))
                        return;
                    topics[topic].forEach(function (subs) { return subs.call(null, data); });
                }, 0);
        };
        var _unsubAll = function (topic) {
            if (topic === void 0) { topic = ''; }
            if (topic)
                delete topics[topic];
            else
                for (var topic_1 in topics)
                    delete topics[topic_1];
        };
        /**
         * Subscribes to a given topic
         * @function
         * @alias subscribe
         * @param { String } topic The topic to listen on
         * @param { Action<any> } cb The actions to be called when publish on subscribed topic
         * @return { UnsubAction } The unsub action
         */
        var subscribe = function (topic, cb) {
            if (!isMyValidString(topic))
                throw Error('Topic has to be a string.');
            if (!isValidAction(cb))
                throw Error('Action has to be a function.');
            if (!_hasTopic(topic))
                topics[topic] = [];
            _subToTopic(topic, cb);
            return function () {
                var index = topics[topic].indexOf(cb);
                topics[topic].splice(index, 1);
            };
        };
        /**
         * Publishes to a given topic
         * @function
         * @alias publish
         * @param { String } topic The topic to publish
         * @param { any } data The data to be published
         * @param { Boolean } sync Indicates if wheather the publish should be asyncronous
         * @return { void }
         */
        var publish = function (topic, data, sync) {
            if (sync === void 0) { sync = false; }
            if (!isMyValidString(topic))
                throw Error('Topic has to be a string.');
            if (!_hasTopic(topic))
                return;
            _notify(topic, data, sync);
        };
        /**
         * Clear all existing subscriptions
         * @function
         * @alias clearAllSubscriptions
         * @return { void }
         */
        var clearAllSubscriptions = function () { return _unsubAll(); };
        /**
         * Clear all existing subscriptions on a given topic
         * @function
         * @alias clearAllByTopic
         * @param { String } topic The topic to remove all subscriptions
         * @return { void }
         */
        var clearAllByTopic = function (topic) {
            if (!isMyValidString(topic))
                throw Error('Topic has to be a string.');
            if (!_hasTopic(topic))
                return;
            _unsubAll(topic);
        };
        /**
         * Gets all topics
         * @function
         * @alias getTopics
         * @return { String[] } The list of topics
         */
        var getTopics = function () { return Object.keys(topics); };
        return {
            subscribe: subscribe,
            publish: publish,
            clearAllSubscriptions: clearAllSubscriptions,
            clearAllByTopic: clearAllByTopic,
            getTopics: getTopics
        };
    })();

    return PubSub;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVic3VianMuZGV2LmpzIiwic291cmNlcyI6WyIuLi9wcmV1bWQvdXRpbHMvYXNzZXJ0aW9ucy5qcyIsIi4uL3ByZXVtZC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdmFyIGlzTXlWYWxpZFN0cmluZyA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgIHJldHVybiB0eXBlb2YgdG9waWMgPT09ICdzdHJpbmcnIHx8IHRvcGljIGluc3RhbmNlb2YgU3RyaW5nO1xufTtcbmV4cG9ydCB2YXIgaXNWYWxpZEFjdGlvbiA9IGZ1bmN0aW9uIChjYikge1xuICAgIHJldHVybiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicgfHwgY2IgaW5zdGFuY2VvZiBGdW5jdGlvbjtcbn07XG4iLCJpbXBvcnQgeyBpc015VmFsaWRTdHJpbmcsIGlzVmFsaWRBY3Rpb24gfSBmcm9tICcuL3V0aWxzL2Fzc2VydGlvbnMnO1xuLyoqXG4gKlxuICogVGhlIFB1YlN1YiBJSUZFXG4gKlxuICovXG52YXIgUHViU3ViID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdG9waWNzID0ge307XG4gICAgdmFyIF9oYXNUb3BpYyA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICAgICByZXR1cm4gdG9waWNzLmhhc093blByb3BlcnR5KHRvcGljKSAmJiB0b3BpY3NbdG9waWNdIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgfTtcbiAgICB2YXIgX3N1YlRvVG9waWMgPSBmdW5jdGlvbiAodG9waWMsIGNiKSB7XG4gICAgICAgIHJldHVybiB0b3BpY3NbdG9waWNdLnB1c2goY2IpO1xuICAgIH07XG4gICAgdmFyIF9ub3RpZnkgPSBmdW5jdGlvbiAodG9waWMsIGRhdGEsIHN5bmMpIHtcbiAgICAgICAgaWYgKHN5bmMgPT09IHZvaWQgMCkgeyBzeW5jID0gZmFsc2U7IH1cbiAgICAgICAgcmV0dXJuIHN5bmNcbiAgICAgICAgICAgID8gdG9waWNzW3RvcGljXS5mb3JFYWNoKGZ1bmN0aW9uIChzdWJzKSB7IHJldHVybiBzdWJzLmNhbGwobnVsbCwgZGF0YSk7IH0pXG4gICAgICAgICAgICA6IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghX2hhc1RvcGljKHRvcGljKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRvcGljc1t0b3BpY10uZm9yRWFjaChmdW5jdGlvbiAoc3VicykgeyByZXR1cm4gc3Vicy5jYWxsKG51bGwsIGRhdGEpOyB9KTtcbiAgICAgICAgICAgIH0sIDApO1xuICAgIH07XG4gICAgdmFyIF91bnN1YkFsbCA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICAgICBpZiAodG9waWMgPT09IHZvaWQgMCkgeyB0b3BpYyA9ICcnOyB9XG4gICAgICAgIGlmICh0b3BpYylcbiAgICAgICAgICAgIGRlbGV0ZSB0b3BpY3NbdG9waWNdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmb3IgKHZhciB0b3BpY18xIGluIHRvcGljcylcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9waWNzW3RvcGljXzFdO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlcyB0byBhIGdpdmVuIHRvcGljXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQGFsaWFzIHN1YnNjcmliZVxuICAgICAqIEBwYXJhbSB7IFN0cmluZyB9IHRvcGljIFRoZSB0b3BpYyB0byBsaXN0ZW4gb25cbiAgICAgKiBAcGFyYW0geyBBY3Rpb248YW55PiB9IGNiIFRoZSBhY3Rpb25zIHRvIGJlIGNhbGxlZCB3aGVuIHB1Ymxpc2ggb24gc3Vic2NyaWJlZCB0b3BpY1xuICAgICAqIEByZXR1cm4geyBVbnN1YkFjdGlvbiB9IFRoZSB1bnN1YiBhY3Rpb25cbiAgICAgKi9cbiAgICB2YXIgc3Vic2NyaWJlID0gZnVuY3Rpb24gKHRvcGljLCBjYikge1xuICAgICAgICBpZiAoIWlzTXlWYWxpZFN0cmluZyh0b3BpYykpXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVG9waWMgaGFzIHRvIGJlIGEgc3RyaW5nLicpO1xuICAgICAgICBpZiAoIWlzVmFsaWRBY3Rpb24oY2IpKVxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0FjdGlvbiBoYXMgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgICAgICAgaWYgKCFfaGFzVG9waWModG9waWMpKVxuICAgICAgICAgICAgdG9waWNzW3RvcGljXSA9IFtdO1xuICAgICAgICBfc3ViVG9Ub3BpYyh0b3BpYywgY2IpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdG9waWNzW3RvcGljXS5pbmRleE9mKGNiKTtcbiAgICAgICAgICAgIHRvcGljc1t0b3BpY10uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFB1Ymxpc2hlcyB0byBhIGdpdmVuIHRvcGljXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQGFsaWFzIHB1Ymxpc2hcbiAgICAgKiBAcGFyYW0geyBTdHJpbmcgfSB0b3BpYyBUaGUgdG9waWMgdG8gcHVibGlzaFxuICAgICAqIEBwYXJhbSB7IGFueSB9IGRhdGEgVGhlIGRhdGEgdG8gYmUgcHVibGlzaGVkXG4gICAgICogQHBhcmFtIHsgQm9vbGVhbiB9IHN5bmMgSW5kaWNhdGVzIGlmIHdoZWF0aGVyIHRoZSBwdWJsaXNoIHNob3VsZCBiZSBhc3luY3Jvbm91c1xuICAgICAqIEByZXR1cm4geyB2b2lkIH1cbiAgICAgKi9cbiAgICB2YXIgcHVibGlzaCA9IGZ1bmN0aW9uICh0b3BpYywgZGF0YSwgc3luYykge1xuICAgICAgICBpZiAoc3luYyA9PT0gdm9pZCAwKSB7IHN5bmMgPSBmYWxzZTsgfVxuICAgICAgICBpZiAoIWlzTXlWYWxpZFN0cmluZyh0b3BpYykpXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVG9waWMgaGFzIHRvIGJlIGEgc3RyaW5nLicpO1xuICAgICAgICBpZiAoIV9oYXNUb3BpYyh0b3BpYykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIF9ub3RpZnkodG9waWMsIGRhdGEsIHN5bmMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2xlYXIgYWxsIGV4aXN0aW5nIHN1YnNjcmlwdGlvbnNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAYWxpYXMgY2xlYXJBbGxTdWJzY3JpcHRpb25zXG4gICAgICogQHJldHVybiB7IHZvaWQgfVxuICAgICAqL1xuICAgIHZhciBjbGVhckFsbFN1YnNjcmlwdGlvbnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfdW5zdWJBbGwoKTsgfTtcbiAgICAvKipcbiAgICAgKiBDbGVhciBhbGwgZXhpc3Rpbmcgc3Vic2NyaXB0aW9ucyBvbiBhIGdpdmVuIHRvcGljXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQGFsaWFzIGNsZWFyQWxsQnlUb3BpY1xuICAgICAqIEBwYXJhbSB7IFN0cmluZyB9IHRvcGljIFRoZSB0b3BpYyB0byByZW1vdmUgYWxsIHN1YnNjcmlwdGlvbnNcbiAgICAgKiBAcmV0dXJuIHsgdm9pZCB9XG4gICAgICovXG4gICAgdmFyIGNsZWFyQWxsQnlUb3BpYyA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICAgICBpZiAoIWlzTXlWYWxpZFN0cmluZyh0b3BpYykpXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVG9waWMgaGFzIHRvIGJlIGEgc3RyaW5nLicpO1xuICAgICAgICBpZiAoIV9oYXNUb3BpYyh0b3BpYykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIF91bnN1YkFsbCh0b3BpYyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXRzIGFsbCB0b3BpY3NcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAYWxpYXMgZ2V0VG9waWNzXG4gICAgICogQHJldHVybiB7IFN0cmluZ1tdIH0gVGhlIGxpc3Qgb2YgdG9waWNzXG4gICAgICovXG4gICAgdmFyIGdldFRvcGljcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIE9iamVjdC5rZXlzKHRvcGljcyk7IH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG4gICAgICAgIHB1Ymxpc2g6IHB1Ymxpc2gsXG4gICAgICAgIGNsZWFyQWxsU3Vic2NyaXB0aW9uczogY2xlYXJBbGxTdWJzY3JpcHRpb25zLFxuICAgICAgICBjbGVhckFsbEJ5VG9waWM6IGNsZWFyQWxsQnlUb3BpYyxcbiAgICAgICAgZ2V0VG9waWNzOiBnZXRUb3BpY3NcbiAgICB9O1xufSkoKTtcbmV4cG9ydCBkZWZhdWx0IFB1YlN1YjtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBTyxJQUFJLGVBQWUsR0FBRyxVQUFVLEtBQUssRUFBRTtJQUM5QyxJQUFJLE9BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssWUFBWSxNQUFNLENBQUM7SUFDaEUsQ0FBQyxDQUFDO0FBQ0YsSUFBTyxJQUFJLGFBQWEsR0FBRyxVQUFVLEVBQUUsRUFBRTtJQUN6QyxJQUFJLE9BQU8sT0FBTyxFQUFFLEtBQUssVUFBVSxJQUFJLEVBQUUsWUFBWSxRQUFRLENBQUM7SUFDOUQsQ0FBQyxDQUFDOztJQ0pGO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxJQUFJLE1BQU0sR0FBRyxDQUFDLFlBQVk7SUFDMUIsSUFBSSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDcEIsSUFBSSxJQUFJLFNBQVMsR0FBRyxVQUFVLEtBQUssRUFBRTtJQUNyQyxRQUFRLE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksS0FBSyxDQUFDO0lBQzlFLEtBQUssQ0FBQztJQUNOLElBQUksSUFBSSxXQUFXLEdBQUcsVUFBVSxLQUFLLEVBQUUsRUFBRSxFQUFFO0lBQzNDLFFBQVEsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLEtB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
