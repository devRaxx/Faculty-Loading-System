const express = require('express')
const {getUserList} = require("../controllers/adminController")
const {requireAdminAuth} = require('../middleware/auth')
const router = express.Router()

router.get('/',getUserList)

module.exports = router