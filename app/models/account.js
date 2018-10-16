const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('config/properties.properties');
const MLabClient = require('../helpers/mlabClient');
var ApiError = require('../helpers/apiError');
var mLabClient = new MLabClient(properties.get('mlab.movements.collection'));

/**
 * Modelado de cuentas
 */
class Account {
    constructor(id, number, clientId, type, alias) {
        let _id = id;
        let _number = number;
        let _clientId = clientId;
        let _type = type;
        let _alias = alias;

        this.toJSON = function () {
            return {id: _id, number: _number, clientId: _clientId, type: _type, alias: _alias};
        };

        this.getNumber = function() {
            return _number;
        };
        this.getClientId = function() {
            return _clientId;
        };
        this.getType = function() {
            return _type;
        };
        this.getId = function() {
            return _id;
        };
        this.getAlias = function() {
            return _alias;
        };
    }

    /**
     * Construye un objeto de tipo cuenta dado un json
     * @param json
     * @returns {Account}
     */
    static buildAccountFromJson(json) {
        return new Account(json._id.$oid, json.number, json.clientId, json.type, json.alias);
    }

    /**
     * Busca las cuentas asociadas a cierto cliente.
     * @param clientId  Identificador del cliente del cual se recuperarán las cuentas.
     * @param fn        Callback a ejecutar una vez terminada la consulta.
     */
    static findByClient(clientId, fn) {
        let payload = {clientId: clientId};
        let filter = {_id: 1, number: 1, clientId: 1, type: 1, alias: 1};
        mLabClient.callGetFunction('', payload, filter, function(err, resM, body) {
            if (err) {
                fn(null, new ApiError('general.internalError'));
            } else if (body && body.length > 0) {
                //Devolvemos las cuentas del cliente
                let accounts = [];
                for (let i = 0; i < body.length; i++) {
                    accounts.push(Account.buildAccountFromJson(body[i]));
                }
                fn(accounts, null);
            } else {
                fn();
            }
        });
    }
}

module.exports = Account;