const db = require("../config/db");
const ExcelJS = require("exceljs");
const { normalizeAcademicYear } = require("../services/academicYear");

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
const REGULAR_TIMES = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-11:15",
  "11:15-12:15",
  "12:15-13:15",
  "13:15-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00"
];
const FOURTH_YEAR_TIMES = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00"
];

function normalizeDepartment(value) {
  const rawValue = String(value || "ECS").trim().toUpperCase();
  const compactValue = rawValue.replace(/[\s&/-]+/g, "_");

  if (compactValue === "SCIENCE_HUMANITIES" || compactValue === "SCIENCE_AND_HUMANITIES") {
    return "SCIENCE_HUMANITIES";
  }

  return compactValue || "ECS";
}

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

function cellText(slot) {
  if (!slot || !slot.subject) return "";
  if (slot.subject === "BREAK") return "BREAK";
  if (slot.subject === "LUNCH") return "LUNCH BREAK";

  return slot.faculty ? `${slot.subject}\n${slot.faculty}` : slot.subject;
}

function displayDepartment(department) {
  if (department === "SCIENCE_HUMANITIES") return "Science & Humanities";
  return department;
}

function uniqueSubjectFacultyRows(rows) {
  const seen = new Set();

  return rows.reduce((result, row) => {
    const subject = String(row.subject || "").trim();
    const faculty = String(row.faculty || "").trim();
    const normalizedSubject = subject.toUpperCase();

    if (!subject || normalizedSubject === "BREAK" || normalizedSubject === "LUNCH") {
      return result;
    }

    const key = `${subject}__${faculty}`;
    if (seen.has(key)) return result;

    seen.add(key);
    result.push({ subject, faculty });
    return result;
  }, []);
}

function applyBorder(cell) {
  cell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };
}

function applyCellBase(cell) {
  applyBorder(cell);
  cell.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true
  };
  cell.font = { name: "Calibri", size: 12 };
}

function estimateTimetableRowHeight(values) {
  const maxLines = values.reduce((highest, value, index) => {
    if (index === 0 || !value) return highest;

    const visualLines = String(value)
      .split("\n")
      .reduce((total, line) => total + Math.max(1, Math.ceil(line.length / 18)), 0);

    return Math.max(highest, visualLines);
  }, 1);

  return Math.max(72, Math.min(118, maxLines * 17 + 18));
}

exports.exportTimetableController = async (req, res) => {
  try {
    const department = normalizeDepartment(req.query.department);
    const year = Number(req.query.year);
    const semester = Number(req.query.semester);
    const academicYear = normalizeAcademicYear(req.query.academicYear);

    if (!year || !semester) {
      return res.status(400).json({ message: "department, year and semester are required" });
    }

    const rows = await query(
      `SELECT day, time, subject, faculty
       FROM timetable_slots
       WHERE academic_year = ? AND department = ? AND year = ? AND semester = ?
       ORDER BY FIELD(day,'MON','TUE','WED','THU','FRI','SAT'), time`,
      [academicYear, department, year, semester]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "No timetable found" });
    }

    const usesSingleLunchBreak = semester <= 2 || year === 4;
    const times = usesSingleLunchBreak ? FOURTH_YEAR_TIMES : REGULAR_TIMES;
    const lastColumn = times.length;
    const detailSubjectEnd = Math.min(4, lastColumn);
    const detailFacultyStart = Math.min(detailSubjectEnd + 1, lastColumn);
    const subjectFacultyRows = uniqueSubjectFacultyRows(rows);
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "DBCE Timetable Hub";
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet("Timetable", {
      pageSetup: {
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        paperSize: 9
      },
      views: [{ showGridLines: false }]
    });

    worksheet.properties.defaultRowHeight = 18;
    worksheet.columns = [
      { width: 14 },
      ...times.map(() => ({ width: 22 }))
    ];

    const colCount = lastColumn + 1;
    const row = (rowNumber) => worksheet.getRow(rowNumber);
    const cell = (rowNumber, colNumber) => worksheet.getCell(rowNumber, colNumber);
    const mergeAcross = (rowNumber, startCol = 1, endCol = colCount) => {
      worksheet.mergeCells(rowNumber, startCol, rowNumber, endCol);
    };

    mergeAcross(1);
    mergeAcross(2);
    mergeAcross(3);
    cell(1, 1).value = "DON BOSCO COLLEGE OF ENGINEERING, FATORDA, MARGAO, GOA";
    cell(2, 1).value = `TIME-TABLE FOR ACADEMIC YEAR ${academicYear}`;
    cell(3, 1).value = `${displayDepartment(department)} - Year ${year}, Semester ${semester}`;

    [1, 2, 3].forEach((rowNumber) => {
      row(rowNumber).height = 19;
      for (let col = 1; col <= colCount; col += 1) {
        const currentCell = cell(rowNumber, col);
        applyBorder(currentCell);
        currentCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        currentCell.font = { name: "Calibri", size: 14, bold: true };
      }
    });

    row(4).height = 5;

    row(5).values = ["DAY / TIME", ...times];
    row(5).height = 32;

    for (let col = 1; col <= colCount; col += 1) {
      const headerCell = cell(5, col);
      applyCellBase(headerCell);
      headerCell.font = { name: "Calibri", size: 12, bold: true };
    }

    DAYS.forEach((day, dayIndex) => {
      const rowNumber = 6 + dayIndex;
      const values = [
        day,
        ...times.map((time) => {
          const slot = rows.find((currentRow) => currentRow.day === day && currentRow.time === time);
          if (usesSingleLunchBreak && time === "12:00-13:00") return "LUNCH BREAK";
          if (!usesSingleLunchBreak && time === "11:00-11:15") return "BREAK";
          if (!usesSingleLunchBreak && time === "13:15-14:00") return "LUNCH BREAK";
          return cellText(slot);
        })
      ];

      row(rowNumber).values = values;
      row(rowNumber).height = estimateTimetableRowHeight(values);

      for (let col = 1; col <= colCount; col += 1) {
        const gridCell = cell(rowNumber, col);
        applyCellBase(gridCell);
        if (col === 1 || values[col - 1] === "BREAK" || values[col - 1] === "LUNCH BREAK") {
          gridCell.font = { name: "Calibri", size: 12, bold: true };
        }
      }
    });

    row(12).height = 8;
    row(13).height = 8;

    const detailHeaderRow = 14;
    const detailColumnHeaderRow = 15;
    mergeAcross(detailHeaderRow);
    cell(detailHeaderRow, 1).value = "SUBJECT / FACULTY DETAILS";
    row(detailHeaderRow).height = 22;

    for (let col = 1; col <= colCount; col += 1) {
      const detailHeaderCell = cell(detailHeaderRow, col);
      applyCellBase(detailHeaderCell);
      detailHeaderCell.font = { name: "Calibri", size: 12, bold: true };
    }

    worksheet.mergeCells(detailColumnHeaderRow, 2, detailColumnHeaderRow, detailSubjectEnd + 1);
    worksheet.mergeCells(detailColumnHeaderRow, detailFacultyStart + 1, detailColumnHeaderRow, colCount);
    cell(detailColumnHeaderRow, 1).value = "Sr. No.";
    cell(detailColumnHeaderRow, 2).value = "Subject";
    cell(detailColumnHeaderRow, detailFacultyStart + 1).value = "Faculty";
    row(detailColumnHeaderRow).height = 22;

    for (let col = 1; col <= colCount; col += 1) {
      const columnHeaderCell = cell(detailColumnHeaderRow, col);
      applyCellBase(columnHeaderCell);
      columnHeaderCell.font = { name: "Calibri", size: 12, bold: true };
    }

    subjectFacultyRows.forEach((item, index) => {
      const rowNumber = detailColumnHeaderRow + 1 + index;
      worksheet.mergeCells(rowNumber, 2, rowNumber, detailSubjectEnd + 1);
      worksheet.mergeCells(rowNumber, detailFacultyStart + 1, rowNumber, colCount);
      cell(rowNumber, 1).value = index + 1;
      cell(rowNumber, 2).value = item.subject;
      cell(rowNumber, detailFacultyStart + 1).value = item.faculty;
      row(rowNumber).height = 22;

      for (let col = 1; col <= colCount; col += 1) {
        applyCellBase(cell(rowNumber, col));
      }
      cell(rowNumber, 2).alignment = { vertical: "middle", horizontal: "left", wrapText: true };
      cell(rowNumber, detailFacultyStart + 1).alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    });

    const signatureRow = Math.max(31, detailColumnHeaderRow + 1 + subjectFacultyRows.length + 4);
    worksheet.mergeCells(signatureRow, 1, signatureRow, Math.min(3, colCount));
    if (colCount >= 7) worksheet.mergeCells(signatureRow, 4, signatureRow, 7);
    if (colCount >= 8) worksheet.mergeCells(signatureRow, 8, signatureRow, colCount);
    cell(signatureRow, 1).value = "Time Table Incharge";
    if (colCount >= 4) cell(signatureRow, 4).value = "Head of Department";
    cell(signatureRow, Math.min(8, colCount)).value = "Principal";
    row(signatureRow).height = 26;

    for (let rowNumber = 1; rowNumber <= signatureRow; rowNumber += 1) {
      for (let col = 1; col <= colCount; col += 1) {
        const currentCell = cell(rowNumber, col);
        if (currentCell.value !== null && currentCell.value !== undefined && currentCell.value !== "") {
          applyBorder(currentCell);
        }
      }
    }

    for (let col = 1; col <= colCount; col += 1) {
      const signatureCell = cell(signatureRow, col);
      applyCellBase(signatureCell);
      signatureCell.font = { name: "Calibri", size: 12, bold: true };
    }

    worksheet.pageSetup.printArea = `A1:${worksheet.getColumn(colCount).letter}${signatureRow}`;
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${department}_${academicYear}_Y${year}_S${semester}_Timetable.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Export failed" });
  }
};
