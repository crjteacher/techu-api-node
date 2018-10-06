//Definiciones de endpoints para manejo de clientes
var express = require('express'),
    router = express.Router();

var User = require('../models/user');
router.get('', function (req, res) {
    console.log('Entré al customers');
});

router.post('', function(req, res) {
    User.createUser(req.body.name, req.body.lastName, req.body.email, req.body.password, function(status, user){
        res.status(status);
        if (status === 201) {
            res.json(user);
        } else {
            console.log("Estatus en el router: " + status);
            res.json({msg: 'No es posible crear el cliente debido a que ya existe un correo igual registrado'});
        }
    });
});

module.exports = router;


