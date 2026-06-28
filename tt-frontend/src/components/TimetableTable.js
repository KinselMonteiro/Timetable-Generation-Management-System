import React from "react";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
<<<<<<< HEAD
=======

>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
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
<<<<<<< HEAD
=======

>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
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

<<<<<<< HEAD
function TimetableTable({ slots, year, semester, swapMode = false, selectedSlots = [], onCellSelect }) {
=======
function TimetableTable({
  slots,
  year,
  semester,
  swapMode = false,
  selectedSlots = [],
  onCellSelect,
  isFacultyView = false
}) {
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
  const data = Array.isArray(slots)
    ? slots
    : Array.isArray(slots?.timetable)
    ? slots.timetable
    : [];
<<<<<<< HEAD
  const usesSingleLunchBreak = Number(semester) <= 2 || Number(year) === 4;
  const times = usesSingleLunchBreak ? FOURTH_YEAR_TIMES : REGULAR_TIMES;
=======

  const usesSingleLunchBreak =
    Number(semester) <= 2 || Number(year) === 4;

  const times = usesSingleLunchBreak
    ? FOURTH_YEAR_TIMES
    : REGULAR_TIMES;
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)

  const getCell = (day, time) => {
    return data.find(
      (s) => s.day === day && s.time === time
    );
  };

  const isSelected = (day, time) => {
<<<<<<< HEAD
    return selectedSlots.some((slot) => slot.day === day && slot.time === time);
=======
    return selectedSlots.some(
      (slot) => slot.day === day && slot.time === time
    );
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
  };

  return (
    <div className="timetable-wrap">
      <table className="timetable-table">
        <thead>
          <tr>
            <th>Day / Time</th>
<<<<<<< HEAD
=======

>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
            {times.map((t) => (
              <th key={t}>{t}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {DAYS.map((day) => (
            <tr key={day}>
              <td className="day-label">{day}</td>

              {times.map((time) => {
                const cell = getCell(day, time);

                if (usesSingleLunchBreak && time === "12:00-13:00") {
                  return (
                    <td key={time} className="slot slot-lunch">
                      <span>Lunch</span>
                    </td>
                  );
                }

                if (!cell || !cell.subject) {
<<<<<<< HEAD
                  return <td key={time} className="slot slot-empty"></td>;
=======
                  return (
                    <td key={time} className="slot slot-empty"></td>
                  );
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
                }

                if (cell.type === "BREAK") {
                  return (
                    <td key={time} className="slot slot-break">
                      <span>Tea Break</span>
                    </td>
                  );
                }

                if (cell.type === "LUNCH") {
                  return (
                    <td key={time} className="slot slot-lunch">
                      <span>Lunch</span>
                    </td>
                  );
                }

                return (
                  <td
                    key={time}
<<<<<<< HEAD
                    className={`slot slot-class ${isSelected(day, time) ? "slot-selected" : ""} ${swapMode ? "slot-clickable" : ""}`}
                    onClick={() => swapMode && onCellSelect?.({ day, time, subject: cell.subject, faculty: cell.faculty })}
                  >
                    <div className="slot-subject">{cell.subject}</div>
                    <div className="slot-faculty">{cell.faculty || "Faculty TBA"}</div>
=======
                    className={`slot slot-class ${
                      isSelected(day, time) ? "slot-selected" : ""
                    } ${swapMode ? "slot-clickable" : ""}`}
                    onClick={() =>
                      swapMode &&
                      onCellSelect?.({
                        day,
                        time,
                        subject: cell.subject,
                        faculty: cell.faculty
                      })
                    }
                  >
                    <div className="slot-subject">
                      {cell.subject}
                    </div>

                    {isFacultyView ? (
                      <>
                        <div className="slot-details">
                          {cell.department}
                        </div>

                        <div className="slot-details">
                          Year {cell.year}
                        </div>

                        <div className="slot-details">
                          Semester {cell.semester}
                        </div>

                        {cell.room && (
                          <div className="slot-details">
                            {cell.room}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="slot-faculty">
                        {cell.faculty || "Faculty TBA"}
                      </div>
                    )}
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

<<<<<<< HEAD
export default TimetableTable;
=======
export default TimetableTable;
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
