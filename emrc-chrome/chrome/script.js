;(function EMRC_PLUGIN(opts) {
    // This should be improved, just a basic notification
    var misConfigured = function() {
        alert('Misconfigured plugin, check your settings');
    }

    var ENDPOINT = opts.endpoint || misConfigured();
    var ELEMENT_ID = opts.elementId || misConfigured();
    var POLL_INTERVAL = opts.pollInterval || 3000;

    var oldValue;
    var element = document.getElementById(ELEMENT_ID);

    function setContext(id, ok) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', ENDPOINT + id, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && xhr.status === 200) {
                ok(id);
            }
        }
        xhr.send();
    }

    function setCurrentId(id) {
        oldValue = id;
    }

    function onTick() {
        var newValue = element.value;
        if(oldValue === newValue) return;

        setContext(newValue, setCurrentId);
    }

    setCurrentId(element.value);
    setInterval(onTick, POLL_INTERVAL);
})({
    endpoint: 'http://localhost:3000/context/',
    elementId: 'VisibleID',
    pollInterval: 500
})

// Attempt to clean up the code a little bit more
// Adds lifecycle management on the script
// It also introduces chrome specific APIs (not ideal when creating FF/IE extensions)

// var EMRC_PLUGIN = EMRC_PLUGIN || (function() {
//     var ENDPOINT,
//         ELEMENT_ID,
//         POLL_INTERVAL;

//     var pollId,
//         element,
//         oldValue;

//     var misConfigured = function() {
//         alert('Misconfigured plugin, check your settings');
//     }

//     function setContext(id, ok) {
//         var xhr = new XMLHttpRequest();
//         xhr.open('GET', ENDPOINT + id, true);
//         xhr.onreadystatechange = function() {
//             if(xhr.readyState === 4 && xhr.status === 200) {
//                 ok();
//             }
//         }
//         xhr.send();
//     }

//     function onTick() {
//         var newValue = element.value;
//         if(oldValue === newValue) return;

//         var setCurrentId = function() {
//             oldValue = newValue;
//         }

//         setContext(newValue, setCurrentId);
//     }

//     function init(opts) {
//         console.log(opts);
//         ENDPOINT = opts.endpoint || misConfigured();
//         ELEMENT_ID = opts.elementId || misConfigured();
//         POLL_INTERVAL = opts.pollInterval || 3000;
//     }

//     function start() {
//         element = document.getElementById(ELEMENT_ID);
//         oldValue = element.value;
//         pollId = setInterval(onTick, POLL_INTERVAL);
//     }

//     function stop() {
//         clearInterval(pollId);
//     }

//     chrome.runtime.onConnect.addListener(function(port) {
//         console.assert(port.name === 'emrc_connection');
//         port.onMessage.addListener(function(msg) {
//             switch(msg.name) {
//                 case 'INIT':
//                     init(msg.payload);
//                     break;
//                 case 'START':
//                     start();
//                     break;
//                 case 'STOP':
//                     stop();
//                     break;
//             }
//         });
//     });
// })()