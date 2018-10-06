/**
 * Modelo para manejo de usuarios.
 * Usamos clousure para no permitir acceso directo a las propiedades del objeto,
 */
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('config/properties.properties');
const MLabClient = require('../helpers/mlabClient');
const bcrypt = require('bcrypt');
const HttpStatus = require('http-status-codes');
const stringUtils = require('../helpers/strings');
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

        this.toJSON = function() {
          return {id: _id, name: _name, lastName: _lastName, email: _email}
        };

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
     * Crea un objeto tipo User a partir de un json dado.
     * @param json
     */
    static buildUserFromJson(json) {
        return new User(json._id.$oid, json.name, json.lastName, json.email, json.password);
    }

    /**
     * Crea un nuevo usuario en la base de datos. Se valida que vengan informados los campos
     * @param name      Nombre(s) del usuario
     * @param lastName  Apellido(s) del usuario
     * @param email     Correo electrónico del usuario. Este atributo debe ser único.
     * @param password  Contraseña del usuario para su porterior acceso.
     * @param fn        Callback a ejecutar una vez hecha la operación de creado.
     */
    static createUser(name, lastName, email, password, fn) {
        //Validamos los parámetros de entrada
        if (stringUtils.isBlank(name) || stringUtils.isBlank(lastName) || !stringUtils.isValidEmail(email)
            || !stringUtils.isValidPassword(password)) {
            fn(HttpStatus.BAD_REQUEST, null);
        } else {
            User.findByEmail(email, function(status, user) {
                if (user) {
                    fn(HttpStatus.CONFLICT, null);
                } else {
                    let collection = properties.get('mlab.users.collection');
                    //Guardamos el usuario
                    let payload = {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: bcrypt.hashSync(password, properties.get('user.api.salt'))
                    };
                    MLabClient.callPostFunction(collection, payload, function (err, resM, body) {
                        if (!err && body) {
                            fn(HttpStatus.CREATED, User.buildUserFromJson(body));
                        } else {
                            fn(HttpStatus.CONFLICT, null);
                        }
                    });
                }
            });
        }
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
                fn(HttpStatus.OK, User.buildUserFromJson(body[0]));
            } else {
                fn(HttpStatus.NO_CONTENT, null);
            }
        });
    }

    static updateUser() {

    }

    static updatePassword() {

    }
}

module.exports = User;