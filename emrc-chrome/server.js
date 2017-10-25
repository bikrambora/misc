var express = require("express");
var cors = require('cors');
var bodyParser = require("body-parser");
var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/context/:id", function(req, res) {
    console.log("Received id: %s", req.params.id);
    res.send();
})


var server = app.listen(3000, function () {
    console.log("Listening on port %s", server.address().port);
});