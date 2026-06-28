const express = require("express");
const router = express.Router();

const {
  getCalendarEvents,
  addCalendarEvent,
  deleteCalendarEvent
} = require("../controllers/calendarController");

router.get("/", getCalendarEvents);
router.post("/", addCalendarEvent);
router.delete("/:id", deleteCalendarEvent);

module.exports = router;