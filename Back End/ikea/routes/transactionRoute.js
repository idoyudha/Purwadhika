const router = require('express').Router()
const { transactionController } = require('../controllers')

router.get('/cart/:iduser', transactionController.getCart)
router.post('/add-cart', transactionController.addCart)
router.delete('/delete-cart', transactionController.deleteCart)
router.patch('/update-cart', transactionController.updateCart)

module.exports = router