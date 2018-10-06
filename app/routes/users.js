//Definiciones de endpoints para manejo de clientes
var express = require('express'),
    router = express.Router();

var User = require('../models/user');
router.get('', function (req, res) {
    console.log('Entré al customers');
});

router.post('', function(req, res) {
    console.log(req.body);
    User.createUser(req.body.name, req.body.lastName, req.body.email, req.body.password);
    res.send(req.body);
});

module.exports = router;


