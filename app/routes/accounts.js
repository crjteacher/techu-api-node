//Definiciones de endpoints para manejo de clientes
var express = require('express'),
    router = express.Router();

var AccountController = require('../controllers/accounts');

/**
 * Listado de todas las cuentas de un cliente
 */
router.get('', AccountController.validate('getAccountsByClient'), (req, res) => AccountController.getAccountsByClient(req, res));



module.exports = router;