//Definiciones de endpoints para manejo de clientes
var express = require('express'),
    router = express.Router();

var UserController = require('../controllers/users');

/**
 * Esta función es llamada antes de cada request.
 */
router.use(function(req, res, next) {
    // Mostramos en la consola información referente a la request
    console.log(req.method, req.url, req.body, req.params);
    //Seguimos a la ruta correspondiente.
    next();
});

/**
 * Listado de usurios
 */
router.get('', function (req, res) {
    console.log('Entré al customers');
});

/**
 * Detalles de un cliente
 */
router.get('/:id', (req, res) => UserController.getUserById(req, res));

/**
 * Alta de un cliente
 */
router.post('', UserController.validate('createUser'), (req, res) => UserController.createUser(req, res));

/**
 * Actualización de los datos básicos de un cliente
 */
router.put('/:id', UserController.validate('updateUser'), (req, res) => UserController.updateUser(req, res));

/**
 * Actualización de la contraseña del usuario
 */
router.put('/:id/password', UserController.validate('updatePassword'), (req, res) => UserController.updateUserPassword(req, res));

module.exports = router;


