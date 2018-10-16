var express = require('express'),
    router = express.Router();

var path = require('path');
var LoginController = require('../controllers/login');

router.use('/users', require('./users'));
router.use('/accounts', require('./accounts'));

router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../index.html"));
});

router.post("/login", LoginController.validate('login'), (req, res) => LoginController.login(req, res));

module.exports = router;
