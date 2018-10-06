const emailValidator = require('email-validator');
var PasswordValidator = require('password-validator');

var schema = new PasswordValidator();
schema.is().min(6)
    .is().max(10)
    .has().digits()
    .has().letters();
/**
 * Verifica si la cadena dada como parámetro es nula o vacía.
 * @param str
 * @returns {boolean}
 */
exports.isEmpty = function (str) {
    return (!str || 0 === str.length);
};

/**
 * Verifica que la cadena dada como parámetro no sea nula, vacía o con solo espacios en blanco.
 * @param str
 * @returns {boolean}
 */
exports.isBlank = function (str) {
    return (this.isEmpty(str) || /^\s*$/.test(str));
};

/**
 * Valida que la cadena dada como parámetro corresponda a una dirección de correo electrónico.
 * @param str
 */
exports.isValidEmail = function (str) {
    return !this.isBlank(str) && emailValidator.validate(str);
};

/**
 * Valida que el password cumpla las reglas de aceptación:
 *  - Mínimo 6 caracteres de longitud
 *  - Máximo 10 caracteres de longitud
 *  - al menos un dígito.
 * @param str
 */
exports.isValidPassword = function(str) {
    return !this.isBlank(str) && schema.validate(str);
};