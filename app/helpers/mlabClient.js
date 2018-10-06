var requestJson = require('request-json');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('config/properties.properties');

/**
 * Clase que maneja las peticiones hacia el API de MLab.
 */
class MLabClient{

    /**
     * Implementación de una llamada tipo GET
     * @param collection Collección mongo objeto de la consulta
     * @param query Json con los parámetros de consulta
     * @param fn Callback a ejecutar una vez se resuelva el llamado a Mlab
     */
    static callGetFunction(collection, query, fn) {
        let mlabUrl = properties.get('mlab.base.url') + '/' + collection + '?apiKey=' + properties.get('mlab.api.key');
        if (query != null) {
            mlabUrl += '&q=' + JSON.stringify(query);
        }
        console.log(mlabUrl);
        let client = requestJson.createClient(mlabUrl);
        client.headers['Content-Type'] = 'application/json';
        client.get('', function(err, resM, body) {
            //Usamos el callback
            console.log(body);
            fn(err, resM, body);
        });
    }

    /**
     * Implementación de una llamado de tipo POST.
     * @param collection  Colección mongo objeto de la consulta
     * @param payload     Body de la petición post
     * @param fn          Callback a ejecutar una vez resuelta la petición
     */
    static callPostFunction(collection, payload, fn) {
        let mlabUrl = properties.get('mlab.base.url') + '/' + collection + '?apiKey=' + properties.get('mlab.api.key');
        console.log(mlabUrl);
        let client = requestJson.createClient(mlabUrl);
        client.headers['Content-Type'] = 'application/json';
        client.post('', payload, function(err, resM, body) {
            console.log(body);
            fn(err, resM, body);
        });
    }
}
module.exports = MLabClient;



