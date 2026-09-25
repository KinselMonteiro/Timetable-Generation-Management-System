// Academic year runs June to May, labelled like "2026-2027" (matches the backend).
export function getCurrentAcademicYear(date = new Date()) {
  const calendarYear = date.getFullYear();
  const startYear = date.getMonth() >= 5 ? calendarYear : calendarYear - 1;
  return `${startYear}-${startYear + 1}`;
}
