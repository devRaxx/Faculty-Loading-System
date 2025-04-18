const express = require('express')
const {
  getDegreePrograms,
  createDegreeProgram
} = require('../controllers/degreeProgramController')
const { requireAuth,requireAdminAuth,requireSuperUserAuth } = require('../middleware/auth')
const router = express.Router()

// // GET a single Bloc
router.get('/:sem', getDegreePrograms)

// POST a Bloc
router.post('/:sem', createDegreeProgram)


module.exports = router