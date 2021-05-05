var express = require('express');
var router = express.Router();
const { home } = require('../controllers')

router.get('/', home.getHomepage)

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
