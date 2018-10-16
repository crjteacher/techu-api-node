/**
 * Modelo para manejo de usuarios.
 * Usamos clousure para no permitir acceso directo a las propiedades del objeto,
 */
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('config/properties.properties');
const MLabClient = require('../helpers/mlabClient');
const bcrypt = require('bcrypt');
const stringUtils = require('../helpers/strings');
var ApiError = require('../helpers/apiError');
var mLabClient = new MLabClient(properties.get('mlab.users.collection'));

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

        this.comparePassword = function (password) {
            return bcrypt.compareSync(password, _password);
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
    }

    /**
     * Compara la igualdad de los atributos de un Usuario, sin considerar el password.
     * @param user          Usuario objeto de la comparación.
     * @param newName       Nombre a comparar con el del usuario.
     * @param newLastName   Apellido a comparar con el del usuario.
     * @param newEmail      Correo electrónico a comparar con el del usuario.
     * @returns {boolean|*}
     */
    static areUserSimpleAttributesEquals(user, newName, newLastName, newEmail) {
        return user.getName() === newName && user.getLastName() === newLastName && user.getEmail() === newEmail;
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
        //Guardamos el usuario
        let payload = {
            name: name, lastName: lastName, email: email,
            password: bcrypt.hashSync(password, properties.get('user.api.salt'))
        };
        mLabClient.callPostFunction('', payload, function (err, resM, body) {
            if (err || !body) {
                fn(null, new ApiError("general.internalError.msg"));
            } else {
                fn(User.buildUserFromJson(body));
            }
        });
    }

    /**
     * Busca un usuario por su id.
     * @param id Identificador del usuario a buscar
     * @param fn Callback a ejecutar una vez resuelta la búsqueda del usuario
     */
    static findById(id, fn) {
        mLabClient.callGetFunction(id, null, null, function(err, resM, body) {
           console.log(body);
           if (err) {
               fn(null, new ApiError("general.internalError"));
           } else if (!stringUtils.isEmpty(body.email)) {
               fn(User.buildUserFromJson(body));
           } else {
               fn();
           }
        });
    }

    /**
     * Busca un usuario por su correo electrónico
     * @param email Correo a buscar en la colección de usuarios.
     * @param fn Callback que resuelve el llamado a la función
     */
    static findByEmail(email, fn) {
        mLabClient.callGetFunction('',{email: email}, null, function (err, resM, body) {
            //El resultado debe ser único, devuelvo el primero de la lista
            if (err) {
                fn(null, new ApiError("general.internalError"));
            }else if (body.length > 0) {
                //llamamos al callback
                fn(User.buildUserFromJson(body[0]));
            } else {
                fn();
            }
        });
    }

    /**
     * Actualiza los datos de un usuario.
     * @param id        Identificador del usuario actualizar
     * @param name      Nombre(s) del usuario
     * @param lastName  Apellido(s) del usuario
     * @param email     Correo electrónico del usuario. Este atributo debe ser único.
     * @param fn        Callback a ejecutar una vez hecha la operación de actualización.
     */
    static updateUser(id, name, lastName, email, fn) {
        let payload = {name: name, lastName: lastName, email: email};
        //Ejecutamos la actualización
        payload['name'] = name;
        payload['lastName'] = lastName;
        payload['email'] = email;
        mLabClient.callPutFunction(id, payload, function (err, resM, body) {
            console.log(body);
            if (err || !body) {
                fn(null, new ApiError("general.internalError"));
            } else {
                fn(User.buildUserFromJson(body));
            }

        });
    }

    /**
     * Actualiza el password del usuario dado como parámetro
     * @param id        Identificador del usuario cuyo password será actualizado
     * @param password
     * @param fn
     */
    static updatePassword(id, password, fn) {
        let payload = {password: bcrypt.hashSync(password, properties.get('user.api.salt'))};
        mLabClient.callPutFunction(id, payload, function (err, resM, body) {
            console.log(body);
            if (err || !body) {
                fn(null, new ApiError("general.internalError"));
            } else {
                fn(User.buildUserFromJson(body));
            }
        });
    }
}

module.exports = User;