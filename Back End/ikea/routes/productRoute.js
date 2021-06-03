const express = require('express')
const router = express.Router()
const { productController } = require('../controllers')

router.get('/', productController.getProduct)
router.get('/category', productController.printCategory)
router.post('/add', productController.addProduct)
router.patch('/update', productController.updateProduct)
router.delete('/delete/:id', productController.deleteProduct)

module.exports = router