const express = require('express')
const { userController } = require('../controllers')
const router = express.Router()

router.get('/', userController.getUser)
router.get('/login', userController.login)
// router.post('/login', userController.login)
router.post('/register', userController.register)

module.exports = router