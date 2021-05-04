const express = require('express')
const { productsController } = require('../controllers')
const router = express.Router() 

// Replace app.get in index.js
router.get('/get-data', productsController.getProducts)

module.exports = router