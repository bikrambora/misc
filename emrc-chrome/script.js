var ENDPOINT = 'http://localhost:3000/context/';
var ELEMENT_ID = 'VisibleID';
var element = document.getElementById(ELEMENT_ID);
var oldValue = element.value;

function onInput() {
    var newValue = element.value;
    if(oldValue === newValue) return;

    oldValue = newValue;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', ENDPOINT + newValue, true);
    xhr.send();
}

setInterval(onInput, 500);