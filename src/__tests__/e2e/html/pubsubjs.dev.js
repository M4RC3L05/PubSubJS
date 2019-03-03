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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVic3VianMuZGV2LmpzIiwic291cmNlcyI6WyIuLi9wcmV1bWQvdXRpbHMvYXNzZXJ0aW9ucy5qcyIsIi4uL3ByZXVtZC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdmFyIGlzTXlWYWxpZFN0cmluZyA9IGZ1bmN0aW9uICh0b3BpYykge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB0b3BpYyA9PT0gJ3N0cmluZycgfHwgdG9waWMgaW5zdGFuY2VvZiBTdHJpbmc7XHJcbn07XHJcbmV4cG9ydCB2YXIgaXNWYWxpZEFjdGlvbiA9IGZ1bmN0aW9uIChjYikge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJyB8fCBjYiBpbnN0YW5jZW9mIEZ1bmN0aW9uO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBpc015VmFsaWRTdHJpbmcsIGlzVmFsaWRBY3Rpb24gfSBmcm9tICcuL3V0aWxzL2Fzc2VydGlvbnMnO1xyXG4vKipcclxuICpcclxuICogVGhlIFB1YlN1YiBJSUZFXHJcbiAqXHJcbiAqL1xyXG52YXIgUHViU3ViID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB0b3BpY3MgPSB7fTtcclxuICAgIHZhciBfaGFzVG9waWMgPSBmdW5jdGlvbiAodG9waWMpIHtcclxuICAgICAgICByZXR1cm4gdG9waWNzLmhhc093blByb3BlcnR5KHRvcGljKSAmJiB0b3BpY3NbdG9waWNdIGluc3RhbmNlb2YgQXJyYXk7XHJcbiAgICB9O1xyXG4gICAgdmFyIF9zdWJUb1RvcGljID0gZnVuY3Rpb24gKHRvcGljLCBjYikge1xyXG4gICAgICAgIHJldHVybiB0b3BpY3NbdG9waWNdLnB1c2goY2IpO1xyXG4gICAgfTtcclxuICAgIHZhciBfbm90aWZ5ID0gZnVuY3Rpb24gKHRvcGljLCBkYXRhLCBzeW5jKSB7XHJcbiAgICAgICAgaWYgKHN5bmMgPT09IHZvaWQgMCkgeyBzeW5jID0gZmFsc2U7IH1cclxuICAgICAgICByZXR1cm4gc3luY1xyXG4gICAgICAgICAgICA/IHRvcGljc1t0b3BpY10uZm9yRWFjaChmdW5jdGlvbiAoc3VicykgeyByZXR1cm4gc3Vicy5jYWxsKG51bGwsIGRhdGEpOyB9KVxyXG4gICAgICAgICAgICA6IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFfaGFzVG9waWModG9waWMpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHRvcGljc1t0b3BpY10uZm9yRWFjaChmdW5jdGlvbiAoc3VicykgeyByZXR1cm4gc3Vicy5jYWxsKG51bGwsIGRhdGEpOyB9KTtcclxuICAgICAgICAgICAgfSwgMCk7XHJcbiAgICB9O1xyXG4gICAgdmFyIF91bnN1YkFsbCA9IGZ1bmN0aW9uICh0b3BpYykge1xyXG4gICAgICAgIGlmICh0b3BpYyA9PT0gdm9pZCAwKSB7IHRvcGljID0gJyc7IH1cclxuICAgICAgICBpZiAodG9waWMpXHJcbiAgICAgICAgICAgIGRlbGV0ZSB0b3BpY3NbdG9waWNdO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZm9yICh2YXIgdG9waWNfMSBpbiB0b3BpY3MpXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9waWNzW3RvcGljXzFdO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlcyB0byBhIGdpdmVuIHRvcGljXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBhbGlhcyBzdWJzY3JpYmVcclxuICAgICAqIEBwYXJhbSB7IFN0cmluZyB9IHRvcGljIFRoZSB0b3BpYyB0byBsaXN0ZW4gb25cclxuICAgICAqIEBwYXJhbSB7IEFjdGlvbjxhbnk+IH0gY2IgVGhlIGFjdGlvbnMgdG8gYmUgY2FsbGVkIHdoZW4gcHVibGlzaCBvbiBzdWJzY3JpYmVkIHRvcGljXHJcbiAgICAgKiBAcmV0dXJuIHsgVW5zdWJBY3Rpb24gfSBUaGUgdW5zdWIgYWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHZhciBzdWJzY3JpYmUgPSBmdW5jdGlvbiAodG9waWMsIGNiKSB7XHJcbiAgICAgICAgaWYgKCFpc015VmFsaWRTdHJpbmcodG9waWMpKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVG9waWMgaGFzIHRvIGJlIGEgc3RyaW5nLicpO1xyXG4gICAgICAgIGlmICghaXNWYWxpZEFjdGlvbihjYikpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdBY3Rpb24gaGFzIHRvIGJlIGEgZnVuY3Rpb24uJyk7XHJcbiAgICAgICAgaWYgKCFfaGFzVG9waWModG9waWMpKVxyXG4gICAgICAgICAgICB0b3BpY3NbdG9waWNdID0gW107XHJcbiAgICAgICAgX3N1YlRvVG9waWModG9waWMsIGNiKTtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0b3BpY3NbdG9waWNdLmluZGV4T2YoY2IpO1xyXG4gICAgICAgICAgICB0b3BpY3NbdG9waWNdLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFB1Ymxpc2hlcyB0byBhIGdpdmVuIHRvcGljXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBhbGlhcyBwdWJsaXNoXHJcbiAgICAgKiBAcGFyYW0geyBTdHJpbmcgfSB0b3BpYyBUaGUgdG9waWMgdG8gcHVibGlzaFxyXG4gICAgICogQHBhcmFtIHsgYW55IH0gZGF0YSBUaGUgZGF0YSB0byBiZSBwdWJsaXNoZWRcclxuICAgICAqIEBwYXJhbSB7IEJvb2xlYW4gfSBzeW5jIEluZGljYXRlcyBpZiB3aGVhdGhlciB0aGUgcHVibGlzaCBzaG91bGQgYmUgYXN5bmNyb25vdXNcclxuICAgICAqIEByZXR1cm4geyB2b2lkIH1cclxuICAgICAqL1xyXG4gICAgdmFyIHB1Ymxpc2ggPSBmdW5jdGlvbiAodG9waWMsIGRhdGEsIHN5bmMpIHtcclxuICAgICAgICBpZiAoc3luYyA9PT0gdm9pZCAwKSB7IHN5bmMgPSBmYWxzZTsgfVxyXG4gICAgICAgIGlmICghaXNNeVZhbGlkU3RyaW5nKHRvcGljKSlcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1RvcGljIGhhcyB0byBiZSBhIHN0cmluZy4nKTtcclxuICAgICAgICBpZiAoIV9oYXNUb3BpYyh0b3BpYykpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBfbm90aWZ5KHRvcGljLCBkYXRhLCBzeW5jKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENsZWFyIGFsbCBleGlzdGluZyBzdWJzY3JpcHRpb25zXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBhbGlhcyBjbGVhckFsbFN1YnNjcmlwdGlvbnNcclxuICAgICAqIEByZXR1cm4geyB2b2lkIH1cclxuICAgICAqL1xyXG4gICAgdmFyIGNsZWFyQWxsU3Vic2NyaXB0aW9ucyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF91bnN1YkFsbCgpOyB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciBhbGwgZXhpc3Rpbmcgc3Vic2NyaXB0aW9ucyBvbiBhIGdpdmVuIHRvcGljXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBhbGlhcyBjbGVhckFsbEJ5VG9waWNcclxuICAgICAqIEBwYXJhbSB7IFN0cmluZyB9IHRvcGljIFRoZSB0b3BpYyB0byByZW1vdmUgYWxsIHN1YnNjcmlwdGlvbnNcclxuICAgICAqIEByZXR1cm4geyB2b2lkIH1cclxuICAgICAqL1xyXG4gICAgdmFyIGNsZWFyQWxsQnlUb3BpYyA9IGZ1bmN0aW9uICh0b3BpYykge1xyXG4gICAgICAgIGlmICghaXNNeVZhbGlkU3RyaW5nKHRvcGljKSlcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1RvcGljIGhhcyB0byBiZSBhIHN0cmluZy4nKTtcclxuICAgICAgICBpZiAoIV9oYXNUb3BpYyh0b3BpYykpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBfdW5zdWJBbGwodG9waWMpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyBhbGwgdG9waWNzXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBhbGlhcyBnZXRUb3BpY3NcclxuICAgICAqIEByZXR1cm4geyBTdHJpbmdbXSB9IFRoZSBsaXN0IG9mIHRvcGljc1xyXG4gICAgICovXHJcbiAgICB2YXIgZ2V0VG9waWNzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gT2JqZWN0LmtleXModG9waWNzKTsgfTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXHJcbiAgICAgICAgcHVibGlzaDogcHVibGlzaCxcclxuICAgICAgICBjbGVhckFsbFN1YnNjcmlwdGlvbnM6IGNsZWFyQWxsU3Vic2NyaXB0aW9ucyxcclxuICAgICAgICBjbGVhckFsbEJ5VG9waWM6IGNsZWFyQWxsQnlUb3BpYyxcclxuICAgICAgICBnZXRUb3BpY3M6IGdldFRvcGljc1xyXG4gICAgfTtcclxufSkoKTtcclxuZXhwb3J0IGRlZmF1bHQgUHViU3ViO1xyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQU8sSUFBSSxlQUFlLEdBQUcsVUFBVSxLQUFLLEVBQUU7SUFDOUMsSUFBSSxPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLFlBQVksTUFBTSxDQUFDO0lBQ2hFLENBQUMsQ0FBQztBQUNGLElBQU8sSUFBSSxhQUFhLEdBQUcsVUFBVSxFQUFFLEVBQUU7SUFDekMsSUFBSSxPQUFPLE9BQU8sRUFBRSxLQUFLLFVBQVUsSUFBSSxFQUFFLFlBQVksUUFBUSxDQUFDO0lBQzlELENBQUMsQ0FBQzs7SUNKRjtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsSUFBSSxNQUFNLEdBQUcsQ0FBQyxZQUFZO0lBQzFCLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLElBQUksSUFBSSxTQUFTLEdBQUcsVUFBVSxLQUFLLEVBQUU7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
