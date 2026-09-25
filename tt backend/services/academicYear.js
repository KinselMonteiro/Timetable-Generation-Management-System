const db = require("../config/db");

// Academic year runs June to May, labelled like "2026-2027".
function getCurrentAcademicYear(date = new Date()) {
  const calendarYear = date.getFullYear();
  const startYear = date.getMonth() >= 5 ? calendarYear : calendarYear - 1;
  return `${startYear}-${startYear + 1}`;
}

function shiftAcademicYear(label, offset) {
  const startYear = Number(String(label).slice(0, 4)) + offset;
  return `${startYear}-${startYear + 1}`;
}

function normalizeAcademicYear(value) {
  const match = String(value || "").trim().match(/^(\d{4})\s*[-/]\s*(\d{2}|\d{4})$/);

  if (!match) {
    return getCurrentAcademicYear();
  }

  const startYear = Number(match[1]);
  return `${startYear}-${startYear + 1}`;
}

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => (err ? reject(err) : resolve(result)));
  });
}

// Adds the academic_year column to timetable_slots once; existing rows are tagged as the current year.
async function ensureAcademicYearColumn() {
  const columns = await query("SHOW COLUMNS FROM timetable_slots LIKE 'academic_year'");
  if (columns.length) return;

  const currentYear = getCurrentAcademicYear();
  await query(
    `ALTER TABLE timetable_slots ADD COLUMN academic_year VARCHAR(9) NOT NULL DEFAULT '${currentYear}' AFTER department`
  );
  await query("ALTER TABLE timetable_slots ALTER COLUMN academic_year DROP DEFAULT");
  await query(
    "CREATE INDEX idx_timetable_selection ON timetable_slots (academic_year, department, year, semester)"
  );
  console.log(`Added academic_year to timetable_slots (existing rows set to ${currentYear})`);
}

module.exports = {
  getCurrentAcademicYear,
  shiftAcademicYear,
  normalizeAcademicYear,
  ensureAcademicYearColumn
};
