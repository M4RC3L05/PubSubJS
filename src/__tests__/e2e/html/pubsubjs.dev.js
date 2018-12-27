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

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var rngBrowser = createCommonjsModule(function (module) {
    // Unique ID creation requires a high quality random # generator.  In the
    // browser this is a little complicated due to unknown quality of Math.random()
    // and inconsistent support for the `crypto` API.  We do the best we can via
    // feature-detection

    // getRandomValues needs to be invoked in a context where "this" is a Crypto
    // implementation. Also, find the complete implementation of crypto on IE11.
    var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                          (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

    if (getRandomValues) {
      // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
      var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

      module.exports = function whatwgRNG() {
        getRandomValues(rnds8);
        return rnds8;
      };
    } else {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var rnds = new Array(16);

      module.exports = function mathRNG() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
          rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return rnds;
      };
    }
    });

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */
    var byteToHex = [];
    for (var i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 0x100).toString(16).substr(1);
    }

    function bytesToUuid(buf, offset) {
      var i = offset || 0;
      var bth = byteToHex;
      // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
      return ([bth[buf[i++]], bth[buf[i++]], 
    	bth[buf[i++]], bth[buf[i++]], '-',
    	bth[buf[i++]], bth[buf[i++]], '-',
    	bth[buf[i++]], bth[buf[i++]], '-',
    	bth[buf[i++]], bth[buf[i++]], '-',
    	bth[buf[i++]], bth[buf[i++]],
    	bth[buf[i++]], bth[buf[i++]],
    	bth[buf[i++]], bth[buf[i++]]]).join('');
    }

    var bytesToUuid_1 = bytesToUuid;

    // **`v1()` - Generate time-based UUID**
    //
    // Inspired by https://github.com/LiosK/UUID.js
    // and http://docs.python.org/library/uuid.html

    var _nodeId;
    var _clockseq;

    // Previous uuid creation time
    var _lastMSecs = 0;
    var _lastNSecs = 0;

    // See https://github.com/broofa/node-uuid for API details
    function v1(options, buf, offset) {
      var i = buf && offset || 0;
      var b = buf || [];

      options = options || {};
      var node = options.node || _nodeId;
      var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

      // node and clockseq need to be initialized to random values if they're not
      // specified.  We do this lazily to minimize issues related to insufficient
      // system entropy.  See #189
      if (node == null || clockseq == null) {
        var seedBytes = rngBrowser();
        if (node == null) {
          // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
          node = _nodeId = [
            seedBytes[0] | 0x01,
            seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
          ];
        }
        if (clockseq == null) {
          // Per 4.2.2, randomize (14 bit) clockseq
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
        }
      }

      // UUID timestamps are 100 nano-second units since the Gregorian epoch,
      // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
      // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
      // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
      var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

      // Per 4.2.1.2, use count of uuid's generated during the current clock
      // cycle to simulate higher resolution clock
      var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

      // Time since last uuid creation (in msecs)
      var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

      // Per 4.2.1.2, Bump clockseq on clock regression
      if (dt < 0 && options.clockseq === undefined) {
        clockseq = clockseq + 1 & 0x3fff;
      }

      // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
      // time interval
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
        nsecs = 0;
      }

      // Per 4.2.1.2 Throw error if too many uuids are requested
      if (nsecs >= 10000) {
        throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
      }

      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;

      // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
      msecs += 12219292800000;

      // `time_low`
      var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
      b[i++] = tl >>> 24 & 0xff;
      b[i++] = tl >>> 16 & 0xff;
      b[i++] = tl >>> 8 & 0xff;
      b[i++] = tl & 0xff;

      // `time_mid`
      var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
      b[i++] = tmh >>> 8 & 0xff;
      b[i++] = tmh & 0xff;

      // `time_high_and_version`
      b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
      b[i++] = tmh >>> 16 & 0xff;

      // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
      b[i++] = clockseq >>> 8 | 0x80;

      // `clock_seq_low`
      b[i++] = clockseq & 0xff;

      // `node`
      for (var n = 0; n < 6; ++n) {
        b[i + n] = node[n];
      }

      return buf ? buf : bytesToUuid_1(b);
    }

    var v1_1 = v1;

    function v4(options, buf, offset) {
      var i = buf && offset || 0;

      if (typeof(options) == 'string') {
        buf = options === 'binary' ? new Array(16) : null;
        options = null;
      }
      options = options || {};

      var rnds = options.random || (options.rng || rngBrowser)();

      // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
      rnds[6] = (rnds[6] & 0x0f) | 0x40;
      rnds[8] = (rnds[8] & 0x3f) | 0x80;

      // Copy bytes to buffer, if provided
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }

      return buf || bytesToUuid_1(rnds);
    }

    var v4_1 = v4;

    var uuid = v4_1;
    uuid.v1 = v1_1;
    uuid.v4 = v4_1;

    var uuid_1 = uuid;

    /**
     * The type of subscriptions actions
     *
     */
    var PubSub = (function () {
        var topics = {};
        var _hasTopic = function (topic) {
            return topics.hasOwnProperty(topic) && topics[topic] instanceof Array;
        };
        var _subToTopic = function (topic, cb) {
            var id = uuid_1.v4();
            topics[topic].push({ id: id, action: cb });
            return id;
        };
        var _unsubFromTopic = function (topic, id) {
            return (topics[topic] = topics[topic].filter(function (subs) { return subs.id !== id; }));
        };
        var _notify = function (topic, data, sync) {
            if (sync === void 0) { sync = false; }
            return sync
                ? topics[topic].forEach(function (subs) { return subs.action.call(null, data); })
                : setTimeout(function () {
                    if (!_hasTopic(topic))
                        return;
                    topics[topic].forEach(function (subs) { return subs.action.call(null, data); });
                }, 0);
        };
        var _unsubAll = function (topic) {
            if (topic === void 0) { topic = ''; }
            if (topic)
                return delete topics[topic];
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
         * @return { Number } The sub id
         */
        var subscribe = function (topic, cb) {
            if (!isMyValidString(topic))
                throw Error('Topic has to be a string.');
            if (!isValidAction(cb))
                throw Error('Action has to be a function.');
            if (!_hasTopic(topic))
                topics[topic] = [];
            return _subToTopic(topic, cb);
        };
        /**
         * Unsubscribes to a given topic
         * @function
         * @alias unsubscribe
         * @param { String } topic The topic to unsubscribe
         * @param { String } id The sub id
         * @return {}
         */
        var unsubscribe = function (topic, id) {
            if (!isMyValidString(topic))
                throw Error('Topic has to be a string.');
            if (!isMyValidString(id))
                throw Error('ID has to be a string.');
            if (!_hasTopic(topic))
                return;
            _unsubFromTopic(topic, id);
        };
        /**
         * Publishes to a given topic
         * @function
         * @alias publish
         * @param { String } topic The topic to publish
         * @param {} data The data to be published
         * @param { Boolean } sync Indicates if wheather the publish should be asyncronous
         * @return {}
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
         * @return {}
         */
        var clearAllSubscriptions = function () { return _unsubAll(); };
        /**
         * Clear all existing subscriptions on a given topic
         * @function
         * @alias clearAllSubscriptions
         * @param { String } topic The topic to remove all subscriptions
         * @return {}
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
         * @alias clearAllSubscriptions
         * @return { String[] } The list of topics
         */
        var getTopics = function () { return Object.keys(topics); };
        return {
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            publish: publish,
            clearAllSubscriptions: clearAllSubscriptions,
            clearAllByTopic: clearAllByTopic,
            getTopics: getTopics
        };
    })();

    return PubSub;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVic3VianMuZGV2LmpzIiwic291cmNlcyI6WyIuLi9wcmV1bWQvdXRpbHMvYXNzZXJ0aW9ucy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy91dWlkL2xpYi9ybmctYnJvd3Nlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy91dWlkL2xpYi9ieXRlc1RvVXVpZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy91dWlkL3YxLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3V1aWQvdjQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvdXVpZC9pbmRleC5qcyIsIi4uL3ByZXVtZC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdmFyIGlzTXlWYWxpZFN0cmluZyA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgIHJldHVybiB0eXBlb2YgdG9waWMgPT09ICdzdHJpbmcnIHx8IHRvcGljIGluc3RhbmNlb2YgU3RyaW5nO1xufTtcbmV4cG9ydCB2YXIgaXNWYWxpZEFjdGlvbiA9IGZ1bmN0aW9uIChjYikge1xuICAgIHJldHVybiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicgfHwgY2IgaW5zdGFuY2VvZiBGdW5jdGlvbjtcbn07XG4iLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgSW4gdGhlXG4vLyBicm93c2VyIHRoaXMgaXMgYSBsaXR0bGUgY29tcGxpY2F0ZWQgZHVlIHRvIHVua25vd24gcXVhbGl0eSBvZiBNYXRoLnJhbmRvbSgpXG4vLyBhbmQgaW5jb25zaXN0ZW50IHN1cHBvcnQgZm9yIHRoZSBgY3J5cHRvYCBBUEkuICBXZSBkbyB0aGUgYmVzdCB3ZSBjYW4gdmlhXG4vLyBmZWF0dXJlLWRldGVjdGlvblxuXG4vLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG9cbi8vIGltcGxlbWVudGF0aW9uLiBBbHNvLCBmaW5kIHRoZSBjb21wbGV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBjcnlwdG8gb24gSUUxMS5cbnZhciBnZXRSYW5kb21WYWx1ZXMgPSAodHlwZW9mKGNyeXB0bykgIT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mKG1zQ3J5cHRvKSAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93Lm1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PSAnZnVuY3Rpb24nICYmIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKSk7XG5cbmlmIChnZXRSYW5kb21WYWx1ZXMpIHtcbiAgLy8gV0hBVFdHIGNyeXB0byBSTkcgLSBodHRwOi8vd2lraS53aGF0d2cub3JnL3dpa2kvQ3J5cHRvXG4gIHZhciBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd2hhdHdnUk5HKCkge1xuICAgIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG4gICAgcmV0dXJuIHJuZHM4O1xuICB9O1xufSBlbHNlIHtcbiAgLy8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuICAvL1xuICAvLyBJZiBhbGwgZWxzZSBmYWlscywgdXNlIE1hdGgucmFuZG9tKCkuICBJdCdzIGZhc3QsIGJ1dCBpcyBvZiB1bnNwZWNpZmllZFxuICAvLyBxdWFsaXR5LlxuICB2YXIgcm5kcyA9IG5ldyBBcnJheSgxNik7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXRoUk5HKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgaWYgKChpICYgMHgwMykgPT09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBybmRzW2ldID0gciA+Pj4gKChpICYgMHgwMykgPDwgMykgJiAweGZmO1xuICAgIH1cblxuICAgIHJldHVybiBybmRzO1xuICB9O1xufVxuIiwiLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG52YXIgYnl0ZVRvSGV4ID0gW107XG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG59XG5cbmZ1bmN0aW9uIGJ5dGVzVG9VdWlkKGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gb2Zmc2V0IHx8IDA7XG4gIHZhciBidGggPSBieXRlVG9IZXg7XG4gIC8vIGpvaW4gdXNlZCB0byBmaXggbWVtb3J5IGlzc3VlIGNhdXNlZCBieSBjb25jYXRlbmF0aW9uOiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMTc1I2M0XG4gIHJldHVybiAoW2J0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sIFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV1dKS5qb2luKCcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBieXRlc1RvVXVpZDtcbiIsInZhciBybmcgPSByZXF1aXJlKCcuL2xpYi9ybmcnKTtcbnZhciBieXRlc1RvVXVpZCA9IHJlcXVpcmUoJy4vbGliL2J5dGVzVG9VdWlkJyk7XG5cbi8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbi8vXG4vLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vTGlvc0svVVVJRC5qc1xuLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxudmFyIF9ub2RlSWQ7XG52YXIgX2Nsb2Nrc2VxO1xuXG4vLyBQcmV2aW91cyB1dWlkIGNyZWF0aW9uIHRpbWVcbnZhciBfbGFzdE1TZWNzID0gMDtcbnZhciBfbGFzdE5TZWNzID0gMDtcblxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9icm9vZmEvbm9kZS11dWlkIGZvciBBUEkgZGV0YWlsc1xuZnVuY3Rpb24gdjEob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG4gIHZhciBiID0gYnVmIHx8IFtdO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgbm9kZSA9IG9wdGlvbnMubm9kZSB8fCBfbm9kZUlkO1xuICB2YXIgY2xvY2tzZXEgPSBvcHRpb25zLmNsb2Nrc2VxICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNsb2Nrc2VxIDogX2Nsb2Nrc2VxO1xuXG4gIC8vIG5vZGUgYW5kIGNsb2Nrc2VxIG5lZWQgdG8gYmUgaW5pdGlhbGl6ZWQgdG8gcmFuZG9tIHZhbHVlcyBpZiB0aGV5J3JlIG5vdFxuICAvLyBzcGVjaWZpZWQuICBXZSBkbyB0aGlzIGxhemlseSB0byBtaW5pbWl6ZSBpc3N1ZXMgcmVsYXRlZCB0byBpbnN1ZmZpY2llbnRcbiAgLy8gc3lzdGVtIGVudHJvcHkuICBTZWUgIzE4OVxuICBpZiAobm9kZSA9PSBudWxsIHx8IGNsb2Nrc2VxID09IG51bGwpIHtcbiAgICB2YXIgc2VlZEJ5dGVzID0gcm5nKCk7XG4gICAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgICAgLy8gUGVyIDQuNSwgY3JlYXRlIGFuZCA0OC1iaXQgbm9kZSBpZCwgKDQ3IHJhbmRvbSBiaXRzICsgbXVsdGljYXN0IGJpdCA9IDEpXG4gICAgICBub2RlID0gX25vZGVJZCA9IFtcbiAgICAgICAgc2VlZEJ5dGVzWzBdIHwgMHgwMSxcbiAgICAgICAgc2VlZEJ5dGVzWzFdLCBzZWVkQnl0ZXNbMl0sIHNlZWRCeXRlc1szXSwgc2VlZEJ5dGVzWzRdLCBzZWVkQnl0ZXNbNV1cbiAgICAgIF07XG4gICAgfVxuICAgIGlmIChjbG9ja3NlcSA9PSBudWxsKSB7XG4gICAgICAvLyBQZXIgNC4yLjIsIHJhbmRvbWl6ZSAoMTQgYml0KSBjbG9ja3NlcVxuICAgICAgY2xvY2tzZXEgPSBfY2xvY2tzZXEgPSAoc2VlZEJ5dGVzWzZdIDw8IDggfCBzZWVkQnl0ZXNbN10pICYgMHgzZmZmO1xuICAgIH1cbiAgfVxuXG4gIC8vIFVVSUQgdGltZXN0YW1wcyBhcmUgMTAwIG5hbm8tc2Vjb25kIHVuaXRzIHNpbmNlIHRoZSBHcmVnb3JpYW4gZXBvY2gsXG4gIC8vICgxNTgyLTEwLTE1IDAwOjAwKS4gIEpTTnVtYmVycyBhcmVuJ3QgcHJlY2lzZSBlbm91Z2ggZm9yIHRoaXMsIHNvXG4gIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAvLyAoMTAwLW5hbm9zZWNvbmRzIG9mZnNldCBmcm9tIG1zZWNzKSBzaW5jZSB1bml4IGVwb2NoLCAxOTcwLTAxLTAxIDAwOjAwLlxuICB2YXIgbXNlY3MgPSBvcHRpb25zLm1zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm1zZWNzIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAvLyBjeWNsZSB0byBzaW11bGF0ZSBoaWdoZXIgcmVzb2x1dGlvbiBjbG9ja1xuICB2YXIgbnNlY3MgPSBvcHRpb25zLm5zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5zZWNzIDogX2xhc3ROU2VjcyArIDE7XG5cbiAgLy8gVGltZSBzaW5jZSBsYXN0IHV1aWQgY3JlYXRpb24gKGluIG1zZWNzKVxuICB2YXIgZHQgPSAobXNlY3MgLSBfbGFzdE1TZWNzKSArIChuc2VjcyAtIF9sYXN0TlNlY3MpLzEwMDAwO1xuXG4gIC8vIFBlciA0LjIuMS4yLCBCdW1wIGNsb2Nrc2VxIG9uIGNsb2NrIHJlZ3Jlc3Npb25cbiAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09PSB1bmRlZmluZWQpIHtcbiAgICBjbG9ja3NlcSA9IGNsb2Nrc2VxICsgMSAmIDB4M2ZmZjtcbiAgfVxuXG4gIC8vIFJlc2V0IG5zZWNzIGlmIGNsb2NrIHJlZ3Jlc3NlcyAobmV3IGNsb2Nrc2VxKSBvciB3ZSd2ZSBtb3ZlZCBvbnRvIGEgbmV3XG4gIC8vIHRpbWUgaW50ZXJ2YWxcbiAgaWYgKChkdCA8IDAgfHwgbXNlY3MgPiBfbGFzdE1TZWNzKSAmJiBvcHRpb25zLm5zZWNzID09PSB1bmRlZmluZWQpIHtcbiAgICBuc2VjcyA9IDA7XG4gIH1cblxuICAvLyBQZXIgNC4yLjEuMiBUaHJvdyBlcnJvciBpZiB0b28gbWFueSB1dWlkcyBhcmUgcmVxdWVzdGVkXG4gIGlmIChuc2VjcyA+PSAxMDAwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXVpZC52MSgpOiBDYW5cXCd0IGNyZWF0ZSBtb3JlIHRoYW4gMTBNIHV1aWRzL3NlYycpO1xuICB9XG5cbiAgX2xhc3RNU2VjcyA9IG1zZWNzO1xuICBfbGFzdE5TZWNzID0gbnNlY3M7XG4gIF9jbG9ja3NlcSA9IGNsb2Nrc2VxO1xuXG4gIC8vIFBlciA0LjEuNCAtIENvbnZlcnQgZnJvbSB1bml4IGVwb2NoIHRvIEdyZWdvcmlhbiBlcG9jaFxuICBtc2VjcyArPSAxMjIxOTI5MjgwMDAwMDtcblxuICAvLyBgdGltZV9sb3dgXG4gIHZhciB0bCA9ICgobXNlY3MgJiAweGZmZmZmZmYpICogMTAwMDAgKyBuc2VjcykgJSAweDEwMDAwMDAwMDtcbiAgYltpKytdID0gdGwgPj4+IDI0ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDE2ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bCAmIDB4ZmY7XG5cbiAgLy8gYHRpbWVfbWlkYFxuICB2YXIgdG1oID0gKG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCkgJiAweGZmZmZmZmY7XG4gIGJbaSsrXSA9IHRtaCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRtaCAmIDB4ZmY7XG5cbiAgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcbiAgYltpKytdID0gdG1oID4+PiAyNCAmIDB4ZiB8IDB4MTA7IC8vIGluY2x1ZGUgdmVyc2lvblxuICBiW2krK10gPSB0bWggPj4+IDE2ICYgMHhmZjtcblxuICAvLyBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGAgKFBlciA0LjIuMiAtIGluY2x1ZGUgdmFyaWFudClcbiAgYltpKytdID0gY2xvY2tzZXEgPj4+IDggfCAweDgwO1xuXG4gIC8vIGBjbG9ja19zZXFfbG93YFxuICBiW2krK10gPSBjbG9ja3NlcSAmIDB4ZmY7XG5cbiAgLy8gYG5vZGVgXG4gIGZvciAodmFyIG4gPSAwOyBuIDwgNjsgKytuKSB7XG4gICAgYltpICsgbl0gPSBub2RlW25dO1xuICB9XG5cbiAgcmV0dXJuIGJ1ZiA/IGJ1ZiA6IGJ5dGVzVG9VdWlkKGIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHYxO1xuIiwidmFyIHJuZyA9IHJlcXVpcmUoJy4vbGliL3JuZycpO1xudmFyIGJ5dGVzVG9VdWlkID0gcmVxdWlyZSgnLi9saWIvYnl0ZXNUb1V1aWQnKTtcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG5cbiAgaWYgKHR5cGVvZihvcHRpb25zKSA9PSAnc3RyaW5nJykge1xuICAgIGJ1ZiA9IG9wdGlvbnMgPT09ICdiaW5hcnknID8gbmV3IEFycmF5KDE2KSA6IG51bGw7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gIH1cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpO1xuXG4gIC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcbiAgcm5kc1s2XSA9IChybmRzWzZdICYgMHgwZikgfCAweDQwO1xuICBybmRzWzhdID0gKHJuZHNbOF0gJiAweDNmKSB8IDB4ODA7XG5cbiAgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG4gIGlmIChidWYpIHtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgMTY7ICsraWkpIHtcbiAgICAgIGJ1ZltpICsgaWldID0gcm5kc1tpaV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZiB8fCBieXRlc1RvVXVpZChybmRzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2NDtcbiIsInZhciB2MSA9IHJlcXVpcmUoJy4vdjEnKTtcbnZhciB2NCA9IHJlcXVpcmUoJy4vdjQnKTtcblxudmFyIHV1aWQgPSB2NDtcbnV1aWQudjEgPSB2MTtcbnV1aWQudjQgPSB2NDtcblxubW9kdWxlLmV4cG9ydHMgPSB1dWlkO1xuIiwiaW1wb3J0IHsgaXNNeVZhbGlkU3RyaW5nLCBpc1ZhbGlkQWN0aW9uIH0gZnJvbSAnLi91dGlscy9hc3NlcnRpb25zJztcbmltcG9ydCB1dWlkIGZyb20gJ3V1aWQnO1xuLyoqXG4gKiBUaGUgdHlwZSBvZiBzdWJzY3JpcHRpb25zIGFjdGlvbnNcbiAqXG4gKi9cbnZhciBQdWJTdWIgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciB0b3BpY3MgPSB7fTtcbiAgICB2YXIgX2hhc1RvcGljID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgICAgIHJldHVybiB0b3BpY3MuaGFzT3duUHJvcGVydHkodG9waWMpICYmIHRvcGljc1t0b3BpY10gaW5zdGFuY2VvZiBBcnJheTtcbiAgICB9O1xuICAgIHZhciBfc3ViVG9Ub3BpYyA9IGZ1bmN0aW9uICh0b3BpYywgY2IpIHtcbiAgICAgICAgdmFyIGlkID0gdXVpZC52NCgpO1xuICAgICAgICB0b3BpY3NbdG9waWNdLnB1c2goeyBpZDogaWQsIGFjdGlvbjogY2IgfSk7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9O1xuICAgIHZhciBfdW5zdWJGcm9tVG9waWMgPSBmdW5jdGlvbiAodG9waWMsIGlkKSB7XG4gICAgICAgIHJldHVybiAodG9waWNzW3RvcGljXSA9IHRvcGljc1t0b3BpY10uZmlsdGVyKGZ1bmN0aW9uIChzdWJzKSB7IHJldHVybiBzdWJzLmlkICE9PSBpZDsgfSkpO1xuICAgIH07XG4gICAgdmFyIF9ub3RpZnkgPSBmdW5jdGlvbiAodG9waWMsIGRhdGEsIHN5bmMpIHtcbiAgICAgICAgaWYgKHN5bmMgPT09IHZvaWQgMCkgeyBzeW5jID0gZmFsc2U7IH1cbiAgICAgICAgcmV0dXJuIHN5bmNcbiAgICAgICAgICAgID8gdG9waWNzW3RvcGljXS5mb3JFYWNoKGZ1bmN0aW9uIChzdWJzKSB7IHJldHVybiBzdWJzLmFjdGlvbi5jYWxsKG51bGwsIGRhdGEpOyB9KVxuICAgICAgICAgICAgOiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9oYXNUb3BpYyh0b3BpYykpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB0b3BpY3NbdG9waWNdLmZvckVhY2goZnVuY3Rpb24gKHN1YnMpIHsgcmV0dXJuIHN1YnMuYWN0aW9uLmNhbGwobnVsbCwgZGF0YSk7IH0pO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgfTtcbiAgICB2YXIgX3Vuc3ViQWxsID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgICAgIGlmICh0b3BpYyA9PT0gdm9pZCAwKSB7IHRvcGljID0gJyc7IH1cbiAgICAgICAgaWYgKHRvcGljKVxuICAgICAgICAgICAgcmV0dXJuIGRlbGV0ZSB0b3BpY3NbdG9waWNdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmb3IgKHZhciB0b3BpY18xIGluIHRvcGljcylcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9waWNzW3RvcGljXzFdO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlcyB0byBhIGdpdmVuIHRvcGljXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQGFsaWFzIHN1YnNjcmliZVxuICAgICAqIEBwYXJhbSB7IFN0cmluZyB9IHRvcGljIFRoZSB0b3BpYyB0byBsaXN0ZW4gb25cbiAgICAgKiBAcGFyYW0geyBBY3Rpb248YW55PiB9IGNiIFRoZSBhY3Rpb25zIHRvIGJlIGNhbGxlZCB3aGVuIHB1Ymxpc2ggb24gc3Vic2NyaWJlZCB0b3BpY1xuICAgICAqIEByZXR1cm4geyBOdW1iZXIgfSBUaGUgc3ViIGlkXG4gICAgICovXG4gICAgdmFyIHN1YnNjcmliZSA9IGZ1bmN0aW9uICh0b3BpYywgY2IpIHtcbiAgICAgICAgaWYgKCFpc015VmFsaWRTdHJpbmcodG9waWMpKVxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1RvcGljIGhhcyB0byBiZSBhIHN0cmluZy4nKTtcbiAgICAgICAgaWYgKCFpc1ZhbGlkQWN0aW9uKGNiKSlcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdBY3Rpb24gaGFzIHRvIGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgICAgIGlmICghX2hhc1RvcGljKHRvcGljKSlcbiAgICAgICAgICAgIHRvcGljc1t0b3BpY10gPSBbXTtcbiAgICAgICAgcmV0dXJuIF9zdWJUb1RvcGljKHRvcGljLCBjYik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBVbnN1YnNjcmliZXMgdG8gYSBnaXZlbiB0b3BpY1xuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBhbGlhcyB1bnN1YnNjcmliZVxuICAgICAqIEBwYXJhbSB7IFN0cmluZyB9IHRvcGljIFRoZSB0b3BpYyB0byB1bnN1YnNjcmliZVxuICAgICAqIEBwYXJhbSB7IFN0cmluZyB9IGlkIFRoZSBzdWIgaWRcbiAgICAgKiBAcmV0dXJuIHt9XG4gICAgICovXG4gICAgdmFyIHVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKHRvcGljLCBpZCkge1xuICAgICAgICBpZiAoIWlzTXlWYWxpZFN0cmluZyh0b3BpYykpXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVG9waWMgaGFzIHRvIGJlIGEgc3RyaW5nLicpO1xuICAgICAgICBpZiAoIWlzTXlWYWxpZFN0cmluZyhpZCkpXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignSUQgaGFzIHRvIGJlIGEgc3RyaW5nLicpO1xuICAgICAgICBpZiAoIV9oYXNUb3BpYyh0b3BpYykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIF91bnN1YkZyb21Ub3BpYyh0b3BpYywgaWQpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUHVibGlzaGVzIHRvIGEgZ2l2ZW4gdG9waWNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAYWxpYXMgcHVibGlzaFxuICAgICAqIEBwYXJhbSB7IFN0cmluZyB9IHRvcGljIFRoZSB0b3BpYyB0byBwdWJsaXNoXG4gICAgICogQHBhcmFtIHt9IGRhdGEgVGhlIGRhdGEgdG8gYmUgcHVibGlzaGVkXG4gICAgICogQHBhcmFtIHsgQm9vbGVhbiB9IHN5bmMgSW5kaWNhdGVzIGlmIHdoZWF0aGVyIHRoZSBwdWJsaXNoIHNob3VsZCBiZSBhc3luY3Jvbm91c1xuICAgICAqIEByZXR1cm4ge31cbiAgICAgKi9cbiAgICB2YXIgcHVibGlzaCA9IGZ1bmN0aW9uICh0b3BpYywgZGF0YSwgc3luYykge1xuICAgICAgICBpZiAoc3luYyA9PT0gdm9pZCAwKSB7IHN5bmMgPSBmYWxzZTsgfVxuICAgICAgICBpZiAoIWlzTXlWYWxpZFN0cmluZyh0b3BpYykpXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVG9waWMgaGFzIHRvIGJlIGEgc3RyaW5nLicpO1xuICAgICAgICBpZiAoIV9oYXNUb3BpYyh0b3BpYykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIF9ub3RpZnkodG9waWMsIGRhdGEsIHN5bmMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2xlYXIgYWxsIGV4aXN0aW5nIHN1YnNjcmlwdGlvbnNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAYWxpYXMgY2xlYXJBbGxTdWJzY3JpcHRpb25zXG4gICAgICogQHJldHVybiB7fVxuICAgICAqL1xuICAgIHZhciBjbGVhckFsbFN1YnNjcmlwdGlvbnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfdW5zdWJBbGwoKTsgfTtcbiAgICAvKipcbiAgICAgKiBDbGVhciBhbGwgZXhpc3Rpbmcgc3Vic2NyaXB0aW9ucyBvbiBhIGdpdmVuIHRvcGljXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQGFsaWFzIGNsZWFyQWxsU3Vic2NyaXB0aW9uc1xuICAgICAqIEBwYXJhbSB7IFN0cmluZyB9IHRvcGljIFRoZSB0b3BpYyB0byByZW1vdmUgYWxsIHN1YnNjcmlwdGlvbnNcbiAgICAgKiBAcmV0dXJuIHt9XG4gICAgICovXG4gICAgdmFyIGNsZWFyQWxsQnlUb3BpYyA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICAgICBpZiAoIWlzTXlWYWxpZFN0cmluZyh0b3BpYykpXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVG9waWMgaGFzIHRvIGJlIGEgc3RyaW5nLicpO1xuICAgICAgICBpZiAoIV9oYXNUb3BpYyh0b3BpYykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIF91bnN1YkFsbCh0b3BpYyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXRzIGFsbCB0b3BpY3NcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAYWxpYXMgY2xlYXJBbGxTdWJzY3JpcHRpb25zXG4gICAgICogQHJldHVybiB7IFN0cmluZ1tdIH0gVGhlIGxpc3Qgb2YgdG9waWNzXG4gICAgICovXG4gICAgdmFyIGdldFRvcGljcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIE9iamVjdC5rZXlzKHRvcGljcyk7IH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG4gICAgICAgIHVuc3Vic2NyaWJlOiB1bnN1YnNjcmliZSxcbiAgICAgICAgcHVibGlzaDogcHVibGlzaCxcbiAgICAgICAgY2xlYXJBbGxTdWJzY3JpcHRpb25zOiBjbGVhckFsbFN1YnNjcmlwdGlvbnMsXG4gICAgICAgIGNsZWFyQWxsQnlUb3BpYzogY2xlYXJBbGxCeVRvcGljLFxuICAgICAgICBnZXRUb3BpY3M6IGdldFRvcGljc1xuICAgIH07XG59KSgpO1xuZXhwb3J0IGRlZmF1bHQgUHViU3ViO1xuIl0sIm5hbWVzIjpbInJuZyIsImJ5dGVzVG9VdWlkIiwidjQiLCJ2MSIsInV1aWQiXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFPLElBQUksZUFBZSxHQUFHLFVBQVUsS0FBSyxFQUFFO0lBQzlDLElBQUksT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxZQUFZLE1BQU0sQ0FBQztJQUNoRSxDQUFDLENBQUM7QUFDRixJQUFPLElBQUksYUFBYSxHQUFHLFVBQVUsRUFBRSxFQUFFO0lBQ3pDLElBQUksT0FBTyxPQUFPLEVBQUUsS0FBSyxVQUFVLElBQUksRUFBRSxZQUFZLFFBQVEsQ0FBQztJQUM5RCxDQUFDLENBQUM7Ozs7Ozs7SUNMRjs7Ozs7OztJQU9BLElBQUksZUFBZSxHQUFHLENBQUMsT0FBTyxNQUFNLENBQUMsSUFBSSxXQUFXLElBQUksTUFBTSxDQUFDLGVBQWUsSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7MkJBQzlGLE9BQU8sUUFBUSxDQUFDLElBQUksV0FBVyxJQUFJLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLElB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
