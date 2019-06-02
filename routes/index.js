var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(403).send('Forbidden');
});
/*
router.get('/', function (req, res) {
  res.send('Hello World!');
});
router.get('/bienvenido/:nombre', function(req, res) {
  res.send('BienVenido!! ' + req.params.nombre + '!!');
});*/
/* GET home page. *//*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

module.exports = router;