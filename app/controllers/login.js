const {body, param, validationResult} = require('express-validator/check');
const stringUtils = require('../helpers/strings');
const User = require('../models/user');
const ApiError = require('../helpers/apiError');
const HttpStatus = require('http-status-codes');
const errorHandler = require('../helpers/errorHandler');

exports.validate = (method) => {
    switch (method) {
        case 'login':
            return [
                body('email', 'Email Inválido').exists().custom(email => {
                    return stringUtils.isValidEmail(email);
                }),
                body('password', 'Password no puede ser vacío').exists()
            ]
    }
};

/**
 * Manejo del login del usuario
 * @param req
 * @param res
 */
exports.login = (req, res) => {
    if (!errorHandler.validate(validationResult, req, res)) {
        return;
    }
    //Buscamos el usuario
    User.findByEmail(req.body.email, (user, err) => {
        if (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        } else if (user) {
            //El usuario fue encontrado. Revisamos si los password coinciden
            if (user.comparePassword(req.body.password)) {
                //Login exitoso. Devolvemos el usuario logueado
                res.status(HttpStatus.OK).json(user);

            } else {
                //Pasword inválido
                res.status(HttpStatus.UNAUTHORIZED).json(new ApiError('login.unauthorized'));
            }
        } else {
            res.status(HttpStatus.UNAUTHORIZED).json(new ApiError('login.unauthorized'));
        }
    });
};