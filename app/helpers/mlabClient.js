var requestJson = require('request-json');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('config/properties.properties');
var stringUtils = require('../helpers/strings');

/**
 * Clase que maneja las peticiones hacia el API de MLab.
 */
class MLabClient {
    /**
     * Construye una nueva instancia del cliente mLab.
     * @param collection Colección mongo objeto de la consulta.
     */
    constructor(collection) {
        if (stringUtils.isEmpty(collection)) {
            this._client = requestJson.createClient(properties.get('mlab.base.url') + '/');
        } else {
            this._client = requestJson.createClient(properties.get('mlab.base.url') + "/collections/" + collection + "/");
        }
        this._client.headers['Content-Type'] = 'application/json';
    }

    get client() {
        return this._client;
    }

    /**
     * Implementación de una llamada tipo GET
     * @param pathParam  Parámetro a nivel URL, si aplica
     * @param query Json con los parámetros de consulta
     * @param filter Json que contiene parámetros para filtrar la consulta
     * @param fn Callback a ejecutar una vez se resuelva el llamado a Mlab
     */
    callGetFunction(pathParam, query, filter, fn) {
        let mlabUrl = '';
        if (!stringUtils.isBlank(pathParam)) {
            mlabUrl += pathParam;
        }
        mlabUrl += '?apiKey=' + properties.get('mlab.api.key');
        if (filter != null) {
            mlabUrl += '&f=' + JSON.stringify(filter);
        }
        if (query != null) {
            mlabUrl += '&q=' + JSON.stringify(query);
        }
        this.client.get(mlabUrl, function (err, resM, body) {
            //Usamos el callback
            fn(err, resM, body);
        });
    }

    /**
     * Implementación de una llamado de tipo POST.
     * @param pathParam   Parámetros a nivel URL, si aplican
     * @param payload     Body de la petición post
     * @param fn          Callback a ejecutar una vez resuelta la petición
     */
    callPostFunction(pathParam, payload, fn) {
        let mlabUrl = '';
        if (!stringUtils.isBlank(pathParam)) {
            mlabUrl += pathParam;
        }
        mlabUrl += '?apiKey=' + properties.get('mlab.api.key');
        this.client.post(mlabUrl, payload, function (err, resM, body) {
            fn(err, resM, body);
        });
    }

    /**
     * Implementación de un llamado tipo PUT
     * @param pathParam     Parámetro a nivel url, si aplica
     * @param payload       Cuerpo de la petición
     * @param fn            Callback a ejecutar una vez resuelta la consulta
     */
    callPutFunction(pathParam, payload, fn) {
        let mlabUrl = '';
        if (!stringUtils.isBlank(pathParam)) {
            mlabUrl += pathParam;
        }
        mlabUrl += '?apiKey=' + properties.get('mlab.api.key');
        payload = {$set: payload}; //Para que solo se actualicen los datos pasados en el payload, sin afectar los demás
        this.client.put(mlabUrl, payload, function (err, resM, body) {
            console.log(err);
            console.log(resM);
            fn(err, resM, body);
        });
    }

    /**
     * Implementación de la ejecución de un comando mongo para queries más especializados
     * @param payload   Payload de ejecución del comando mongo
     * @param fn        Callback a ejecutar una vez ejecutado el comando
     */
    executeMongoCommand(payload, fn) {
        let mlabUrl = 'runCommand?apiKey=' + properties.get('mlab.api.key');
        this.client.post(mlabUrl, payload, function(err, resM, body) {
           fn(err, resM, body);
        });
    }
}
module.exports = MLabClient;



