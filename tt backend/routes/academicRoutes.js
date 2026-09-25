const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const {
  uploadSubjectsController,
  getSubjectsController,
  previewTimetableController,
  saveTimetableController,
  generateTimetableController,
  getTimetableController,
  getSavedTimetablesController,
  getAcademicYearsController,
  getTeacherTimetableController,
  swapSlotsController,
  getFacultyAvailabilityController,
  createFacultyRequestController,
  getFacultyRequestsController,
  acceptFacultyRequestController,
  uploadStudentsController,
  getStudentsController,
  getAttendanceController,
  saveAttendanceController,
  getAttendanceSummaryController,
} = require("../controllers/academicController");

router.post(
  "/upload-subjects",
  upload.single("file"), // 🔥 THIS WAS MISSING OR WRONG
  uploadSubjectsController
);

router.get("/subjects", getSubjectsController);
router.post("/preview-timetable", previewTimetableController);
router.post("/save-timetable", saveTimetableController);
router.post("/generate-timetable", generateTimetableController);
router.get("/timetable", getTimetableController);
router.get("/saved-timetables", getSavedTimetablesController);
router.get("/academic-years", getAcademicYearsController);
router.get("/teacher-timetable", getTeacherTimetableController);
router.post("/swap-slots", swapSlotsController);
router.get("/faculty-availability", getFacultyAvailabilityController);
router.post("/faculty-requests", createFacultyRequestController);
router.get("/faculty-requests", getFacultyRequestsController);
router.patch("/faculty-requests/:id/accept", acceptFacultyRequestController);
router.post("/upload-students", upload.single("file"), uploadStudentsController);
router.get("/students", getStudentsController);
router.get("/attendance", getAttendanceController);
router.post("/attendance", saveAttendanceController);
router.get("/attendance-summary", getAttendanceSummaryController);

module.exports = router;
