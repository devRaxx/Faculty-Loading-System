const express = require('express')
const {
    createRoom, getSemRooms
} = require('../controllers/roomController')
const { requireAuth,requireAdminAuth,requireSuperUserAuth } = require('../middleware/auth')
const router = express.Router()

router.post("/:sem", createRoom)

router.get("/:sem", getSemRooms)

module.exports = router