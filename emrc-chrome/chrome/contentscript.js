var script = document.createElement('script');
script.onload = function(e) {
    // If we want to manage its lifecycle
    // Right permissions will need to be set
    // var conn = chrome.runtime.connect({ name: 'emrc_connection' });
    // conn.postMessage({
    //     name: 'INIT',
    //     payload: {
    //         endpoint: 'http://localhost:3000/context/',
    //         elementId: 'VisibleID',
    //         pollInterval: 500
    //     }
    // });
    // conn.postMessage({
    //     name: 'START'
    // });
    // conn.postMessage({
    //     name: 'STOP'
    // });
    this.remove();
};
script.src = chrome.extension.getURL('script.js');
(document.head || document.documentElement).appendChild(script);