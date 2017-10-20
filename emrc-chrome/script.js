var ENDPOINT = 'http://localhost:3000/context/';

var ELEMENT_ID = 'patient_id';
var element = document.getElementById(ELEMENT_ID);
var oldValue = element.value;

function onInput(e) {
    var newValue = element.value;
    if(oldValue === newValue) return;

    oldValue = newValue;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', ENDPOINT + newValue, true);
    xhr.send();
}

element.addEventListener('input', onInput);