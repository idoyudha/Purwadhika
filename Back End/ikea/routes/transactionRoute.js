const router = require('express').Router()
const { transactionController } = require('../controllers')
const { readToken } = require('../config')

router.get('/cart/:iduser', readToken, transactionController.getCart)
router.post('/add-cart', transactionController.addCart)
router.delete('/delete-cart/:id', transactionController.deleteCart)
router.patch('/update-cart', transactionController.updateCart)
router.patch('/update-cart-prod', transactionController.updateSameProductInCart)
router.post('/payment/:iduser', readToken, transactionController.moveToTransaction)
router.get('/payment/:iduser', readToken, transactionController.getTransaction)
router.patch('/pay/:idtransaction', transactionController.payButton)

module.exports = router