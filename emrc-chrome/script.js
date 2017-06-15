var oldValue = document.getElementById('patient_id').value;

function checkIfValueChanged() {
    var newValue = document.getElementById('patient_id').value;
    if(newValue != oldValue) {
        //alert('value changed');
        var xhr = new XMLHttpRequest();
        //xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
        xhr.open("GET", 'http://localhost:3000/context/'+newValue, true);
        xhr.send();
        oldValue = newValue;
    }
}

setInterval(checkIfValueChanged, 500);