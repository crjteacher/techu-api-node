const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('config/properties.properties');

/**
 * Clase para modelar errores, en caso de que ocurran.
 */
class ApiError {
    constructor(alias) {
        let _code = properties.get(alias + '.code');
        let _msg = properties.get(alias + '.msg');

        this.toJSON = function () {
            return {code: _code, msg: _msg};
        };
    }
}

module.exports = ApiError;