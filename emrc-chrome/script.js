(function EMRC_PLUGIN(opts) {
    var misConfigured = function() {
        alert('Misconfigured plugin, check your settings');
    }

    var ENDPOINT = opts.endpoint || misConfigured();
    var ELEMENT_ID = opts.elementId || misConfigured();
    var POLL_INTERVAL = opts.pollInterval || 3000;

    var element = document.getElementById(ELEMENT_ID);
    var oldValue = element.value;

    function setContext(id) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', ENDPOINT + id, true);
        xhr.send();
    }

    function onTick() {
        var newValue = element.value;
        if(oldValue === newValue) return;

        oldValue = newValue;
        setContext(newValue);
    }

    setInterval(onTick, POLL_INTERVAL);
})({
    endpoint: 'http://localhost:3000/context/',
    elementId: 'VisibleID',
    pollInterval: 500
})