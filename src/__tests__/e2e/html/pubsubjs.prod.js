!function(r,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(r=r||self).PubSubJS=n()}(this,function(){"use strict";var u=function(r){return"string"==typeof r||r instanceof String};for(var r,p=(function(r){var n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(n){var t=new Uint8Array(16);r.exports=function(){return n(t),t}}else{var o=new Array(16);r.exports=function(){for(var r,n=0;n<16;n++)0==(3&n)&&(r=4294967296*Math.random()),o[n]=r>>>((3&n)<<3)&255;return o}}}(r={exports:{}},r.exports),r.exports),e=[],n=0;n<256;++n)e[n]=(n+256).toString(16).substr(1);var y,h,b=function(r,n){var t=n||0,o=e;return[o[r[t++]],o[r[t++]],o[r[t++]],o[r[t++]],"-",o[r[t++]],o[r[t++]],"-",o[r[t++]],o[r[t++]],"-",o[r[t++]],o[r[t++]],"-",o[r[t++]],o[r[t++]],o[r[t++]],o[r[t++]],o[r[t++]],o[r[t++]]].join("")},m=0,g=0;var t=function(r,n,t){var o=n&&t||0,e=n||[],i=(r=r||{}).node||y,u=void 0!==r.clockseq?r.clockseq:h;if(null==i||null==u){var a=p();null==i&&(i=y=[1|a[0],a[1],a[2],a[3],a[4],a[5]]),null==u&&(u=h=16383&(a[6]<<8|a[7]))}var c=void 0!==r.msecs?r.msecs:(new Date).getTime(),s=void 0!==r.nsecs?r.nsecs:g+1,f=c-m+(s-g)/1e4;if(f<0&&void 0===r.clockseq&&(u=u+1&16383),(f<0||m<c)&&void 0===r.nsecs&&(s=0),1e4<=s)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");m=c,h=u;var l=(1e4*(268435455&(c+=122192928e5))+(g=s))%4294967296;e[o++]=l>>>24&255,e[o++]=l>>>16&255,e[o++]=l>>>8&255,e[o++]=255&l;var d=c/4294967296*1e4&268435455;e[o++]=d>>>8&255,e[o++]=255&d,e[o++]=d>>>24&15|16,e[o++]=d>>>16&255,e[o++]=u>>>8|128,e[o++]=255&u;for(var v=0;v<6;++v)e[o+v]=i[v];return n||b(e)};var o=function(r,n,t){var o=n&&t||0;"string"==typeof r&&(n="binary"===r?new Array(16):null,r=null);var e=(r=r||{}).random||(r.rng||p)();if(e[6]=15&e[6]|64,e[8]=63&e[8]|128,n)for(var i=0;i<16;++i)n[o+i]=e[i];return n||b(e)},i=o;i.v1=t,i.v4=o;var a,c,s,f=i;return a={},c=function(r){return a.hasOwnProperty(r)&&a[r]instanceof Array},s=function(r){if(void 0===r&&(r=""),r)return delete a[r];for(var n in a)delete a[n]},{subscribe:function(r,n){if(!u(r))throw Error("Topic has to be a string.");if(!("function"==typeof(t=n)||t instanceof Function))throw Error("Action has to be a function.");var t,o,e,i;return c(r)||(a[r]=[]),o=r,e=n,i=f.v4(),a[o].push({id:i,action:e}),i},unsubscribe:function(r,n){if(!u(r))throw Error("Topic has to be a string.");if(!u(n))throw Error("ID has to be a string.");var t,o;c(r)&&(o=n,a[t=r]=a[t].filter(function(r){return r.id!==o}))},publish:function(r,n,t){if(void 0===t&&(t=!1),!u(r))throw Error("Topic has to be a string.");var o,e,i;c(r)&&(o=r,e=n,void 0===(i=t)&&(i=!1),i?a[o].forEach(function(r){return r.action.call(null,e)}):setTimeout(function(){c(o)&&a[o].forEach(function(r){return r.action.call(null,e)})},0))},clearAllSubscriptions:function(){return s()},clearAllByTopic:function(r){if(!u(r))throw Error("Topic has to be a string.");c(r)&&s(r)},getTopics:function(){return Object.keys(a)}}});
