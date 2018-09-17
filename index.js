var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var requestjson = require('request-json');

var path = require('path');

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});