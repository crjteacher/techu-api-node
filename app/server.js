var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Esta función es llamada antes de cada request.
 */
app.use(function(req, res, next) {
    // Mostramos en la consola información referente a la request
    console.log(req.method, req.url, req.body, req.params);
    //Seguimos a la ruta correspondiente.
    next();
});

app.use(require('./routes'));
app.listen(port);

console.log('ApiNode server started on port ' + port);
