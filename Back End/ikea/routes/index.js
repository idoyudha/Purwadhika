// var express = require('express');
// var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

const homeRoute = require('./homeRoute')
const userRoute = require('./userRoute')

module.exports = {
  homeRoute,
  userRoute
}

