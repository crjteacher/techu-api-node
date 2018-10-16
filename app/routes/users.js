//Definiciones de endpoints para manejo de clientes
var express = require('express'),
    router = express.Router();

var UserController = require('../controllers/users');

/**
 * Listado de usuarios
 */
// router.get('', function (req, res) {
//     console.log('Entré al customers');
// });

/**
 * Detalles de un cliente
 */
router.get('/:id', UserController.validate('getUserById'), (req, res) => UserController.getUserById(req, res));

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


