const express = require('express')
const {
  getSummary
} = require('../controllers/summaryController')
const { requireAuth,requireAdminAuth,requireSuperUserAuth } = require('../middleware/auth')
const router = express.Router()

// GET summary
router.get('/:semId', getSummary)

module.exports = router

