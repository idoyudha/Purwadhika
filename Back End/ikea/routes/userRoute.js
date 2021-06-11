const express = require('express')
const { userController } = require('../controllers')
const router = express.Router()
const { readToken } = require('../config') 

router.get('/', userController.getUser)
router.post('/login', userController.login)
router.post('/keeplogin', readToken, userController.keepLogin)
router.post('/register', userController.register)
router.patch('/verification', readToken, userController.verification)
router.patch('/reverification', userController.reverification)

module.exports = router