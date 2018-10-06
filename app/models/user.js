/**
 * Modelo para manejo de usuarios.
 * Usamos clousure para no permitir acceso directo a las propiedades del objeto,
 */
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('config/properties.properties');
var MLabClient = require('../helpers/mlabClient');

/**
 * Clase que contiene la definición de atributos y métodos para los usuarios.
 */
class User {
    constructor(id, name, lastName, email, password) {
        let _id = id;
        let _name = name;
        let _lastName = lastName;
        let _email = email;
        let _password = password;

        /******Algunos Getters******/
        this.getId = function(){
            return _id;
        };
        this.getName = function() {
            return _name;
        };
        this.getLastName = function() {
            return _lastName;
        };
        this.getEmail = function () {
            return _email;
        };
        this.getPassword = function () {
            return _password;
        };

        /*****Algunos setters*****/
        this.setName = function(name) {
            _name = name;
        };
        this.setLastName = function(lastName) {
            _lastName = lastName;
        };
        this.setEmail = function(email) {
            _email = email;
        };
        this.setPassword = function(password) {
            _password = password;
        }
    }

    /**
     * Crea un nuevo usuario en la base de datos. Se valida que vengan informados los campos
     * @param name
     * @param lastName
     * @param email
     * @param password
     */
    static createUser(name, lastName, email, password) {
        User.findByEmail(email);
    }

    static findById() {

    }

    /**
     * Busca un usuario por su correo electrónico
     * @param email Correo a buscar en la colección de usuarios.
     * @param fn Callback que resuelve el llamado a la función
     */
    static findByEmail(email, fn) {
        let collection = properties.get('mlab.users.collection');
        MLabClient.callGetFunction(collection, {email: email}, function (err, resM, body) {
            //El resultado debe ser único, devuelvo el primero de la lista
            console.log(resM.statusCode);
            if (!err && body.length > 0) {
                //llamamos al callback
                fn(resM.statusCode, body[0]);
            } else {
                fn(resM.statusCode, null);
            }
        });
    }

    static updateUser() {

    }

    static updatePassword() {

    }
}

module.exports = User;