var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();
var stringUtils = require("../../app/helpers/strings");

/**
 * Casos de prueba para isEmpty()
 */
describe ("isEmpty() function", function() {
   it("Is a null string", function () {
       (stringUtils.isEmpty(null)).should.equal(true);
   });
    it("Is an undefined string", function () {
        (stringUtils.isEmpty(undefined)).should.equal(true);
    });
    it("Is an empty string", function () {
        (stringUtils.isEmpty('')).should.equal(true);
    });
    it("Is not an empty string", function () {
        (stringUtils.isEmpty('hi!')).should.equal(false);
    });
    it("Is an only spaces string", function () {
        (stringUtils.isEmpty('       ')).should.equal(false);
    });
});

/**
 * Casos de prueba para el isBlank()
 */
describe ("isBlank function", function() {
    it("Is a null string", function () {
        (stringUtils.isBlank(null)).should.equal(true);
    });
    it("Is an undefined string", function () {
        (stringUtils.isBlank(undefined)).should.equal(true);
    });
    it("Is an empty string", function () {
        (stringUtils.isBlank('')).should.equal(true);
    });
    it("Is an only spaces string", function () {
        (stringUtils.isBlank('       ')).should.equal(true);
    });
    it("Is a spaces, \\n, \\t \\r combination", function () {
        (stringUtils.isBlank("\n\n\t    \r\t\n")).should.equal(true);
    });
    it("Is not an empty string", function () {
        (stringUtils.isBlank('hi!')).should.equal(false);
    });
});

/**
 * Casos de prueba para la utilería validadora de emails
 */
describe("isValidEmail function", function() {
    it("Is a valid email with only letters", function () {
        let isValid = stringUtils.isValidEmail("cristian@bbva.com");
        expect(isValid).to.be.true;
    });
    it("Is a valid email with letters, numbers an underscore", function () {
        let isValid = stringUtils.isValidEmail("nombre_11233_@dominio.com");
        expect(isValid).to.be.true;
    });
    it("Is a valid email with multiple letters, digits an other characters combination", function () {
        let isValid =  stringUtils.isValidEmail("_123.nombre.prueba__@dominio.com");
        expect(isValid).to.be.true;
    });
    it("Is an invalid email without @ symbol", function() {
       let isInvalid = stringUtils.isValidEmail("cristian.bbva.com");
       isInvalid.should.equal(false);
    });
    it("Is an invalid email without data before @ character", function() {
        let isInvalid = stringUtils.isValidEmail("@bbva.com");
        isInvalid.should.equal(false);
    });
    it("Is an invalid email with two @ symbols", function() {
        let isInvalid = stringUtils.isValidEmail("cristian@bbva@bbva.com");
        isInvalid.should.equal(false);
    });
    it("Is an invalid email without domain at the end", function() {
        let isInvalid = stringUtils.isValidEmail("cristian@bbva");
        isInvalid.should.equal(false);
    });
    it("Is a null email", function() {
        let isInvalid = stringUtils.isValidEmail(null);
        isInvalid.should.equal(false);
    });
    it("Is an undefined email", function() {
        let isInvalid = stringUtils.isValidEmail(undefined);
        isInvalid.should.equal(false);
    });
});

/**
 * Casos de prueba para la validación del password
 */
describe("isValidPassword function", function() {
   it("Is a six characters length valid password", function() {
       (stringUtils.isValidPassword("mScre1")).should.equal(true);
   });
   it("Is a ten characters length valid password", function() {
        (stringUtils.isValidPassword("11_87y%4rv")).should.equal(true);
   });
   it("Is an invalid four characters length password", function() {
       (stringUtils.isValidPassword("1_yr")).should.equal(false);
   });
   it("Is an invalid only letters eight characters length password", function() {
        (stringUtils.isValidPassword("gtgterde")).should.equal(false);
   });
   it("Is an invalid only digits six characters length password", function() {
        (stringUtils.isValidPassword("876543")).should.equal(false);
   });
   it("Is an invalid eleven characters length password", function() {
        (stringUtils.isValidPassword("__765rfvtr3")).should.equal(false);
   });
   it("Is a null password", function () {
       (stringUtils.isValidPassword(null)).should.equal(false);
   });
   it("Is an undefined password", function () {
        (stringUtils.isValidPassword(undefined)).should.equal(false);
   });
   it("Is a empty password", function () {
        (stringUtils.isValidPassword('')).should.equal(false);
   });
});