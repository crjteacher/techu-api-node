const HttpStatus = require('http-status-codes');
const ApiError = require('../helpers/apiError');
/**
 * Método auxiliar para manejar validaciones de datos de entrada
 * @param validationResult  Manejador de errores para express
 * @param req               Express request
 * @param res               Express response
 */
exports.validate = function(validationResult, req, res) {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(HttpStatus.BAD_REQUEST).json(new ApiError("general.wrongParameters"));
        return false;
    }
    return true;
};