const router = require('express').Router()
const { transactionController } = require('../controllers')

router.get('/cart/:iduser', transactionController.getCart)
router.post('/add-cart', transactionController.addCart)
router.delete('/delete-cart/:id', transactionController.deleteCart)
router.patch('/update-cart', transactionController.updateCart)
router.patch('/update-cart-prod', transactionController.updateSameProductInCart)
router.post('/payment/:iduser', transactionController.moveToTransaction)
router.get('/payment/:iduser', transactionController.getTransaction)

module.exports = router