const express = require("express");
const {
  createSemester,
  getAllSemester,
  copySemester,
  getSemesterInformation,
  deleteSemester,
} = require("../controllers/semesterController");
const {
  requireAuth,
  requireAdminAuth,
  requireSuperUserAuth,
} = require("../middleware/auth");
const router = express.Router();

// GET all Blocs
router.post("/", createSemester);

router.get("/", getAllSemester);

router.get("/:sem", getSemesterInformation);

router.post("/copy", copySemester);

router.delete("/", deleteSemester);

module.exports = router;
