const express = require('express')
const { productsController } = require('../controllers')
const router = express.Router() 

// Replace app.get in index.js
router.get('/', productsController.getProducts)
router.post('/', productsController.postProducts)
router.put('/:id', productsController.putProducts)
router.patch('/:id', productsController.patchProducts)
router.delete('/:id', productsController.deleteProducts)

module.exports = router