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
	var mes = req.body[0].month;
	var anhio = req.body[0].anhio;
	
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
	var mes = req.body[0].month;
	var anhio = req.body[0].anhio;
	//console.log(mes);
	datosCOI.getDatosCuentasXDpto(mes,anhio)
    .then((response) => {
		
		res.status(200).json(response);
		

    })
    .catch((error) => {
        res.status(500).json(error);
    });

});
//Obtener Datos Ventas por departamentos para EC por CC RUBRO 6 (Ventas/Ingresos)
router.post('/getDatosVentasXDptoParaERXCC', function(req, res, next) {
	var mes = req.body.month;
	var anhio = req.body.anhio;
	var dpto = req.body.dpto;
	//console.log(mes+" "+dpto);
	datosCOI.getVentasXdepartamentos(dpto)
    .then((response) => {
		
		res.status(200).json(response);
		

    })
    .catch((error) => {
        res.status(500).json(error);
    });

});
//Obtener Datos Gastos Generales por departamentos para EC por CC RUBRO 7 (Gastos Generales)
router.post('/getDatosGastosGeneralesXDptoParaERXCC', function(req, res, next) {
	var mes = req.body.month;
	var anhio = req.body.anhio;
	var dpto = req.body.dpto;
	//console.log(mes);
	datosCOI.getGastosGeneralesXdepartamentos(dpto)
    .then((response) => {
		
		res.status(200).json(response);
		

    })
    .catch((error) => {
        res.status(500).json(error);
    });

});
module.exports = router;
