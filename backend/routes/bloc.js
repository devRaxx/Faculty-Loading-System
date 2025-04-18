const express = require('express')
const {
  getSemBlocs,
  createBloc
} = require('../controllers/blocController')
const { requireAuth,requireAdminAuth,requireSuperUserAuth } = require('../middleware/auth')
const router = express.Router()

// // GET a single Bloc
router.get('/:sem', getSemBlocs)

// POST a Bloc
router.post('/:sem', createBloc)


module.exports = router