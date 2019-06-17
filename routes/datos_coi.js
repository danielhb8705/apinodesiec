var express = require('express');
var router = express.Router();
const datosCOI = require('../models/datoscoi.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(403).send('Forbidden');
});


router.post('/getDepartamentos', function(req, res, next) {
	datosCOI.getDepartamentos()
    .then((response) => {
		res.status(200).json(response);
    })
    .catch((error) => {
        res.status(500).json(error);
    });
});
//Obtener Datos para todas las cuentas
router.post('/getDatosCuentas', function(req, res, next) {
	var mes = req.body.month;
	var anhio = req.body.anhio;
	//console.log(mes);
	datosCOI.getDatosCuentas(mes,anhio)
    .then((response) => {
		
		res.status(200).json(response);
		
    })
    .catch((error) => {
        res.status(500).json(error);
    });
	
	
});
//Obtener Datos para todas las cuentas
router.post('/getDatosCuentasXDpto', function(req, res, next) {
	var mes = req.body.month;
	var anhio = req.body.anhio;
	//console.log(mes);
	datosCOI.getDatosCuentasXDpto(mes,anhio)
    .then((response) => {
		
		res.status(200).json(response);
		

    })
    .catch((error) => {
        res.status(500).json(error);
    });

});
module.exports = router;
