var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(403).send('Forbidden');
});


router.post('/getUserApps', function(req, res, next) {
  
});
module.exports = router;
