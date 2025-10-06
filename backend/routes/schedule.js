const express = require("express");
const {
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");
const {
  requireAuth,
  requireAdminAuth,
  requireSuperUserAuth,
} = require("../middleware/auth");
const router = express.Router();

router.get("/:id", getSchedule);

router.post("/:sem", createSchedule);

router.patch("/:sem", updateSchedule);

router.delete("/:sem", deleteSchedule);

module.exports = router;
