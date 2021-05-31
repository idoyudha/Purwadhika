const router = require('express').Router()
const { transactionController } = require('../controllers')

router.get('/cart/:iduser', transactionController.getCart)
router.post('/add-cart', transactionController.addCart)
router.delete('/delete-cart/:id', transactionController.deleteCart)
router.patch('/update-cart', transactionController.updateCart)
router.patch('/update-cart-prod', transactionController.updateSameProductInCart)

module.exports = router