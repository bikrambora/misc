var ENDPOINT = 'http://localhost:3000/context/';
var ELEMENT_ID = 'VisibleID';
var POLL_INTERVAL = 500;
var element = document.getElementById(ELEMENT_ID);
var oldValue = element.value;

function setContext(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', ENDPOINT + id, true);
    xhr.send();
}

function onInput() {
    var newValue = element.value;
    if(oldValue === newValue) return;

    oldValue = newValue;
    setContext(newValue);
}

setInterval(onInput, POLL_INTERVAL);