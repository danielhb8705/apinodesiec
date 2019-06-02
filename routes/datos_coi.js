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
        if(!response.result){
            res.status(500).json(error);
        } else {
            res.status(200).json(response);
        }
    })
    .catch((error) => {
        res.status(500).json(error);
    });
});
module.exports = router;
