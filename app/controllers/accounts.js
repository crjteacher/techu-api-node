const {body, param, query, validationResult} = require('express-validator/check');
const stringUtils = require('../helpers/strings');
const Account = require('../models/account');
const ApiError = require('../helpers/apiError');
const HttpStatus = require('http-status-codes');
const errorHandler = require('../helpers/errorHandler');

/**
 * Validaciones sobre parámetros de entrada.
 * @param method
 * @returns {*[]}
 */
exports.validate = (method) => {
    switch (method) {
        case 'getAccountsByClient':
            return [
                query('client', 'Cliente inválido').exists().matches(/\w+/)
            ];
    }
};

/**
 * Búsqueda de las cuentas asociadas a determinado cliente
 * @param req
 * @param res
 */
exports.getAccountsByClient = (req, res) => {
    if (!errorHandler.validate(validationResult, req, res)) {
        return;
    }
    Account.findByClient(req.query.client, (acc, error) => {
       if (error) {
           res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
       } else if (acc) {
           //Devolvemos la lista de cuenta asociadas al usuario
           res.status(HttpStatus.OK).json({data: acc});
       } else {
           res.status(HttpStatus.NO_CONTENT).json({});
       }
    });
};



