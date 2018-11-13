const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('config/properties.properties');
const MLabClient = require('../helpers/mlabClient');
var ApiError = require('../helpers/apiError');
var mLabClient = new MLabClient('');

/**
 * Modelado de movimientos de cuenta
 */
class Movement {
    constructor (accountNumber, date, amount, type) {
        let _accountNumber = accountNumber;
        let _date = date;
        let _amount = amount;
        let _type = type;

        this.toJSON = function() {
          return {accountNumber: _accountNumber, date: _date, amount: _amount, type: _type}
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
        }
    }

    /**
     * Construye un objeto de tipo movimiento dado un json
     * @param accountNumber
     * @param json
     * @returns {Movement}
     */
    static buildMovementFromJson(accountNumber, json) {
        return new Movement(accountNumber, json.date.$date, json.amount, json.type);
    }

    /**
     * Busca los movimientos de la cuenta dada como parámetro
     * @param accountNumber
     * @param startDate
     * @param endDate
     * @param sortOrder
     * @param orderBy
     * @param fn
     */
    static findByAccount(accountNumber, startDate, endDate, sortOrder, orderBy, fn) {
        let payload = {
            aggregate: properties.get('mlab.movements.collection'),
            pipeline: [
                {
                    $match: {
                        $and: [
                            {number: accountNumber}
                        ]
                    }
                },
                {
                    $project: {
                        movements: {
                            $filter: {
                                input: "$movements",
                                as: "m",
                                cond: {

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

        mLabClient.executeMongoCommand(payload, function(err, resM, body) {
            console.log('Inside findByAccount. body: ');
            console.log(body);
            console.log(err);
        });
    }
}
module.exports = Movement;