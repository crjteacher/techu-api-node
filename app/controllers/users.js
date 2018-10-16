const {body, param, validationResult} = require('express-validator/check');
const stringUtils = require('../helpers/strings');
const User = require('../models/user');
const ApiError = require('../helpers/apiError');
const HttpStatus = require('http-status-codes');
const errorHandler = require('../helpers/errorHandler');

/**
 * Validaciones para los métodos asociados a manejo de usuarios
 * @param method
 * @returns {*[]}
 */
exports.validate = (method) => {
    switch (method) {
        case 'getUserById':
            return [
              param('id', 'Id inválido').exists().matches(/\w+/)
            ];
        case 'createUser':
            return [
                body('name', 'Nombre inválido').exists().isLength({min:2, max: 30}).matches(/\w+/),
                body('lastName', 'Apellido inválido').exists().isLength({min: 2, max: 30}).matches(/\w+/),
                body('email', 'Email Inválido').exists().custom(email => {
                    return stringUtils.isValidEmail(email);
                }),
                body('password', 'Invalid password').exists().custom(password => {
                    return stringUtils.isValidPassword(password);
                })
            ];
        case 'updateUser':
            return [
                param('id', 'Id inválido').exists().matches(/\w+/),
                body('name', 'Nombre inválido').exists().isLength({min:2, max: 30}).matches(/\w+/),
                body('lastName', 'Apellido inválido').exists().isLength({min: 2, max: 30}).matches(/\w+/),
                body('email', 'Email Inválido').exists().custom(email => {
                    return stringUtils.isValidEmail(email);
                }),
            ];
        case 'updatePassword':
            return [
                param('id', 'Id inválido').exists().matches(/\w+/),
                body('newPassword', 'Invalid password').exists().custom(password => {
                    return stringUtils.isValidPassword(password);
                }),
                body('oldPassword').exists()
            ];
    }
};

/**
 * Consulta un usurio por su identificador.
 * @param req
 * @param res
 * @returns {*}
 */
exports.getUserById = (req, res) => {
    if (!errorHandler.validate(validationResult, req, res)) {
        return;
    }
    User.findById(req.params.id, (user, error) => {
        if (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        } else if (user) {
            res.status(HttpStatus.OK).json(user);
        } else {
            res.status(HttpStatus.NO_CONTENT).json();
        }
    });
};

/**
 * Crea un nuevo usuario en la base de datos.
 * @param req
 * @param res
 * @returns {*}
 */
exports.createUser = (req, res) => {
    if (!errorHandler.validate(validationResult, req, res)) {
        return;
    }
    User.findByEmail(req.body.email, (user, error) => {
        if (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        } else if (user) {
            res.status(HttpStatus.CONFLICT).json(new ApiError('user.alreadyExists'));
        } else {
            User.createUser(req.body.name, req.body.lastName, req.body.email, req.body.password,
                (newUser, newError) => {
                    if (!newUser || newError) {
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(newError);
                    } else {
                        res.status(HttpStatus.CREATED).json(newUser);
                    }
                });
        }
    });
};

/**
 * Actualiza los datos básicos de un usuario.
 * @param req
 * @param res
 * @returns {*}
 */
exports.updateUser = (req, res) => {
    if (!errorHandler.validate(validationResult, req, res)) {
        return;
    }
    //Buscamos el usuario
    User.findById(req.params.id, (user, error) => {
        if (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        } else if (user) {
            //Validamos si es necesario actualizar algo
            if (!User.areUserSimpleAttributesEquals(user, req.body.name, req.body.lastName, req.body.email)) {
                //El correo electrónico no debe repetirse entre diferentes usuarios
                User.findByEmail(req.body.email, (emailUser, emailError) => {
                    if (emailError) {
                      //Hubo un problema al hacer la consulta. Abortamos con un error técnico
                      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(emailError);
                    } else if (emailUser && emailUser.getEmail() === req.body.email && emailUser.getId() !== req.params.id) {
                        //El email ya está registrado para otra persona. Abortamos.
                        res.status(HttpStatus.CONFLICT).json(new ApiError("user.alreadyExists"));
                    } else {
                        //Es seguro hacer la actualización. Procedemos.
                        User.updateUser(req.params.id, req.body.name, req.body.lastName, req.body.email, (updatedUser, updatedError) => {
                           if (updatedError || !updatedUser) {
                               //Error técnico
                               res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(updatedError);
                           } else {
                               res.status(HttpStatus.OK).json(updatedUser);
                           }
                        });
                    }
                });
            } else {
                //No hace falta actualizar nada
                res.status(HttpStatus.CONFLICT).json(new ApiError("user.update.nothingToUpdate"));
            }
        } else {
            //El usuario no fue encontrado
            res.status(HttpStatus.CONFLICT).json(new ApiError("user.update.notFound"));
        }
    })
};

/**
 * Cambio de contraseña para un cliente.
 * @param req
 * @param res
 */
exports.updateUserPassword = (req, res) => {
    if (!errorHandler.validate(validationResult, req, res)) {
        return;
    }
    User.findById(req.params.id, (user, error) => {
        if (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        } else if (!user) {
            res.status(HttpStatus.CONFLICT).json(new ApiError('user.update.notFound'));
        } else if (user.comparePassword(req.body.oldPassword)) {
            //Hacemos la operación de actualización
            User.updatePassword(req.params.id, req.body.newPassword, (updatedUser, updatedError) => {
                if (updatedError || !updatedUser) {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(updatedError);
                } else {
                    res.status(HttpStatus.OK).json(updatedUser);
                }
            });
        } else {
            //El pass anterior no coincide. Abortamos.
            res.status(HttpStatus.CONFLICT).json(new ApiError("user.changePassword.invalidPassword"));
        }
    });
};

