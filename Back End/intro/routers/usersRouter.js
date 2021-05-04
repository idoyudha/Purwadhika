const express = require('express')
const { usersController } = require('../controllers')
const router = express.Router()

router.get('/', usersController.getUsers)
router.post('/', usersController.postUsers)
router.patch('/', usersController.patchUsers)

module.exports = router