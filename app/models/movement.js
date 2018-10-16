/**
 * Modelado de movimientos de cuenta
 */
class Movement {
    constructor (id, account, date, amount, type) {
        let _id = id;
        let _account = account;
        let _date = date;
        let _amount = amount;
        let _type = type;

        this.getId = function() {
            return _id;
        };

        this.getAccount = function() {
            return _account;
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
}