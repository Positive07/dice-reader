"use strict";var precacheConfig=[["/dice-reader/index.html","2a2092314fcb602c55d72a78680b789d"],["/dice-reader/static/css/main.058ff152.css","946f6f7d3931248f39c8ba7d6c77d17a"],["/dice-reader/static/js/main.61ae91b3.js","671d4e00b9ed7d9e1a7d0def2cfe6868"],["/dice-reader/static/media/roboto-condensed-latin-300.46541d7e.woff","46541d7e305fb9addd5587982622b6d5"],["/dice-reader/static/media/roboto-condensed-latin-300.47d23646.woff2","47d236461410ac106632ff91703dc1e7"],["/dice-reader/static/media/roboto-condensed-latin-300italic.2725306a.woff2","2725306a42ebdc07761dc58d9313c3b2"],["/dice-reader/static/media/roboto-condensed-latin-300italic.2f3c7709.woff","2f3c7709effe4b17c051534d186851ae"],["/dice-reader/static/media/roboto-condensed-latin-400.587de8ec.woff2","587de8ec039052f50e69c9654439b991"],["/dice-reader/static/media/roboto-condensed-latin-400.6da41a0d.woff","6da41a0de9bcf1627a01686cb1cd0d31"],["/dice-reader/static/media/roboto-condensed-latin-400italic.3919beb4.woff","3919beb4a174b0dd85b5394385797ab2"],["/dice-reader/static/media/roboto-condensed-latin-400italic.e21bf4e6.woff2","e21bf4e6adbbcebeedb2d078d9dbeeca"],["/dice-reader/static/media/roboto-condensed-latin-700.bf9fec98.woff","bf9fec987ff2e712826d1da62c84d86c"],["/dice-reader/static/media/roboto-condensed-latin-700.c074f8ef.woff2","c074f8ef4aea2b67fa0ae380041dacdf"],["/dice-reader/static/media/roboto-condensed-latin-700italic.fb176197.woff","fb176197b2a78824ad98f96d1ab63f59"],["/dice-reader/static/media/roboto-condensed-latin-700italic.fd4c5ff6.woff2","fd4c5ff666d375be9ef9fb958af6e602"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,n,a){var r=new URL(e);return a&&r.pathname.match(a)||(r.search+=(r.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),r.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return n.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],a=new URL(t,self.location),r=createCacheKey(a,hashParamName,n,/\.\w{8}\./);return[a.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(a){return setOfCachedUrls(a).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return a.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!n.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,n=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),a="index.html";(e=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,a),e=urlsToCacheKeys.has(n));var r="/dice-reader/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(n=new URL(r,self.location).toString(),e=urlsToCacheKeys.has(n)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});