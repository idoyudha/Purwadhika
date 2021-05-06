const express = require('express')
const { userController } = require('../controllers')
const router = express.Router()

router.get('/', userController.getUser)
router.get('/', userController.login)
router.post('/', userController.register)

module.exports = router