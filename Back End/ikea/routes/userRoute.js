const express = require('express')
const { userController } = require('../controllers')
const router = express.Router()
const { readToken } = require('../config') 

router.get('/', userController.getUser)
// router.get('/login', userController.login)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.patch('/verification', readToken, userController.verification)
router.patch('/reverification', userController.reverification)

module.exports = router