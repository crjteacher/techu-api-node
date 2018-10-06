//Definiciones de endpoints para manejo de movimientos
var express = require('express'),
    router = express.Router();

var requestjson = require('request-json');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('config/properties.properties');

router.get('', function (req, res) {
    var url_mlab = properties.get('mlab.base.url') + '/' + properties.get('mlab.movements.collection') + '?apiKey=' + properties.get('mlab.api.key');
    console.log(url_mlab);
    var clienteMLab = requestjson.createClient(url_mlab);
    clienteMLab.get('', function(err, resM, body) {
        if(err) {
            console.log(body);
        } else {
            console.log(body);
            res.send(body);
        }
    });
});

module.exports = router;