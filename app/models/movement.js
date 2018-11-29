const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('config/properties.properties');
const MLabClient = require('../helpers/mlabClient');
var ApiError = require('../helpers/apiError');
const stringUtils = require('../helpers/strings');
var mLabClient = new MLabClient('');

/**
 * Modelado de movimientos de cuenta
 */
class Movement {
    constructor (accountNumber, date, amount, type, description) {
        let _accountNumber = accountNumber;
        let _date = date;
        let _amount = amount;
        let _type = type;
        let _description = description;

        this.toJSON = function() {
          return {accountNumber: _accountNumber, date: _date, amount: _amount, type: _type, description: _description}
        };

        this.getAccountNumber = function() {
            return _accountNumber;
        };

        this.getDate = function() {
            return _date;
        };

        this.getAmount = function() {
            return _amount;
        };

        this.getType = function () {
            return _type;
        };

        this.getDescription = function() {
            return _description;
        }
    }

    /**
     * Construye un objeto de tipo movimiento dado un json
     * @param accountNumber
     * @param json
     * @returns {Movement}
     */
    static buildMovementFromJson(accountNumber, json) {
        return new Movement(accountNumber, json.date.$date, json.amount, json.type, json.description);
    }

    /**
     * Busca los movimientos de la cuenta dada como parámetro
     * @param accountNumber
     * @param startDate Se espera omo ISODate
     * @param endDate   Se espera como ISODate
     * @param sortOrder ASC or DESC
     * @param type      Tipo de movimento (ABONO, RETIRO)
     * @param fn        Callback function a ejecutar una vez resuelto el query
     */
    static findByAccount(accountNumber, startDate, endDate, sortOrder, type, fn) {
        let payload = this.buildListMovementsQuery(accountNumber, startDate, endDate, type, sortOrder);

        mLabClient.executeMongoCommand(payload, function(err, resM, body) {
            if (err || !body) {
                console.log(err);
                fn(null, new ApiError("general.internalError"));
            } else {
                let movements = [];
                let firstBatch = body.cursor.firstBatch;
                for (let i = 0; i < firstBatch.length; i++) {
                    movements.push(Movement.buildMovementFromJson(accountNumber, firstBatch[i].movements));
                }
                fn(null, movements);
            }
        });
    }

    /**
     * Método auxiliar para construir el query que realiza la búsqueda de los movimientos, de acuerdo a los parámetros
     * de filrtrado indicados.
     * @param accountNumber     Número de cuenta sobre la que se buscarán los movimientos
     * @param startDate         Fecha inicial
     * @param endDate           Fecha fin
     * @param type              Tipo de movimeinto por el que queremos filtrar (ABONO, RETIRO)
     * @param sortOrder         ASC (Ascendente) o DESC (Descendente)
     */
    static buildListMovementsQuery(accountNumber, startDate, endDate, type, sortOrder) {
        let payload = {
            aggregate: properties.get('mlab.movements.collection'),
            pipeline: [
                {
                    $match: {
                        number: accountNumber
                    }
                },
                {
                    $project: {
                        movements: {
                            $filter: {
                                input: "$movements",
                                as: "m",
                                cond: {
                                    $and: [

                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $unwind: "$movements"
                },
                {
                    $sort: {
                        "movements.date": -1
                    }
                }
            ],
            explain: false
        };
        if (!stringUtils.isEmpty(startDate)) {
            payload.pipeline[1].$project.movements.$filter.cond.$and.push({$gte: ["$$m.date", {$date: startDate}]})
        }
        if (!stringUtils.isEmpty(endDate)) {
            payload.pipeline[1].$project.movements.$filter.cond.$and.push({$lte: ["$$m.date", {$date: endDate}]})
        }
        if (!stringUtils.isEmpty(type)) {
            payload.pipeline[1].$project.movements.$filter.cond.$and.push({$eq: ["$$m.type", type]})
        }
        if (!stringUtils.isEmpty(sortOrder) && sortOrder === 'ASC') {
            payload.pipeline[3].$sort["movements.date"] = 1
        }
        return payload;
    }
}
module.exports = Movement;