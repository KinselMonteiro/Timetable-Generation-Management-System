import { useCallback, useEffect, useRef, useState } from "react";
import API from "../services/api";

const DAY_ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
const REQUEST_TIMES = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "11:15-12:15",
  "12:15-13:15",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00"
];
const DEPARTMENTS = ["ECS", "COMP", "MECH", "CIVIL", "SCIENCE_HUMANITIES"];
const DATE_DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function formatRequestDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function displayRequestDate(value) {
  return formatRequestDate(value) || "Date not set";
}

function displayRequestStatus(status) {
  if (status === "OPEN") return "Pending";
  if (status === "ACCEPTED") return "Accepted";
  if (status === "DECLINED") return "Declined";
  return status || "Pending";
}

function dayFromDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return DATE_DAY_NAMES[date.getDay()] || "";
}

function TeacherTimetable({ user, activeTab = "timetable" }) {
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [availableFaculty, setAvailableFaculty] = useState([]);
  const [openRequests, setOpenRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [attendanceSlots, setAttendanceSlots] = useState([]);
  const [attendanceStudents, setAttendanceStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [selectedAttendanceSlot, setSelectedAttendanceSlot] = useState(null);
  const [attendanceFile, setAttendanceFile] = useState(null);
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendanceForm, setAttendanceForm] = useState({
    department: user?.department || "ECS",
    year: "4",
    semester: "7",
    attendanceDate: todayInputValue()
  });
  const [notificationPermission, setNotificationPermission] = useState(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }

    return window.Notification.permission;
  });
  const seenRequestIdsRef = useRef(new Set());
  const hasLoadedRequestsRef = useRef(false);
  const [requestForm, setRequestForm] = useState({
    department: user?.department || "ECS",
    year: "2",
    semester: "3",
    requestDate: todayInputValue(),
    day: "MON",
    time: "09:00-10:00",
    subject: "",
    reason: ""
  });

  const loadTeacherTimetable = useCallback(() => {
    if (!user?.facultyName) {
      setSlots([]);
      setMessage("No faculty name is linked to this teacher account.");
      return;
    }

    API.get("/teacher-timetable", {
      params: { facultyName: user.facultyName }
    })
      .then((res) => {
        const nextSlots = res.data.slots || [];
        setSlots(nextSlots);
        setMessage(nextSlots.length ? "" : "No saved timetable slots found for this teacher yet.");
      })
      .catch((err) => {
        setSlots([]);
        setMessage(err.response?.data?.message || "Could not load teacher timetable.");
      });
  }, [user]);

  const showDesktopNotification = useCallback((request) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (window.Notification.permission !== "granted") return;

    const requestSubject = request.subject || "Substitution request";
    const requestDate = formatRequestDate(request.requestDate);
    const requestTime = [requestDate, request.day, request.time].filter(Boolean).join(" ");

    try {
      new window.Notification("New faculty request", {
        body: `${request.requesterFaculty || "A faculty member"} needs cover for ${requestSubject}${requestTime ? ` on ${requestTime}` : ""}.`,
        tag: `faculty-request-${request.id}`,
        requireInteraction: true
      });
    } catch (error) {
      // Some browser settings can block notifications after permission changes.
    }
  }, []);

  const loadRequests = useCallback(() => {
    API.get("/faculty-requests", {
      params: {
        facultyName: user?.facultyName || "",
        department: user?.department || ""
      }
    })
      .then((res) => {
        const nextOpenRequests = res.data.openRequests || [];
        const previousIds = seenRequestIdsRef.current;
        const isReadyToNotify = hasLoadedRequestsRef.current;

        if (isReadyToNotify) {
          nextOpenRequests
            .filter((request) => !previousIds.has(request.id))
            .forEach(showDesktopNotification);
        }

        seenRequestIdsRef.current = new Set(nextOpenRequests.map((request) => request.id));
        hasLoadedRequestsRef.current = true;
        setOpenRequests(nextOpenRequests);
        setMyRequests(res.data.myRequests || []);
      })
      .catch(() => {
        setOpenRequests([]);
        setMyRequests([]);
      });
  }, [showDesktopNotification, user]);

  useEffect(() => {
    loadTeacherTimetable();
    loadRequests();

    const requestRefresh = setInterval(loadRequests, 20000);
    return () => clearInterval(requestRefresh);
  }, [loadRequests, loadTeacherTimetable]);

  const updateRequestForm = (field, value) => {
    setRequestForm((current) => ({ ...current, [field]: value }));
  };

  const updateAttendanceForm = (field, value) => {
    setAttendanceForm((current) => ({ ...current, [field]: value }));
    setSelectedAttendanceSlot(null);
    setAttendanceStudents([]);
    setAttendanceRecords({});
  };

  const enableDesktopNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationPermission("unsupported");
      setRequestMessage("Desktop notifications are not supported in this browser.");
      return;
    }

    const permission = await window.Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === "granted") {
      setRequestMessage("Desktop notifications enabled. Keep this teacher page open to receive request alerts.");
      return;
    }

    if (permission === "denied") {
      setRequestMessage("Notifications are blocked in the browser. Allow notifications for localhost in browser settings to use this.");
      return;
    }

    setRequestMessage("Notifications were not enabled yet.");
  };

  const checkAvailability = async () => {
    try {
      const res = await API.get("/faculty-availability", {
        params: {
          department: requestForm.department,
          year: Number(requestForm.year),
          semester: Number(requestForm.semester),
          day: requestForm.day,
          time: requestForm.time
        }
      });
      const list = res.data.availableFaculty || [];
      setAvailableFaculty(list);
      setAvailabilityMessage(list.length ? "" : "No free faculty found for this slot.");
    } catch (err) {
      setAvailableFaculty([]);
      setAvailabilityMessage(err.response?.data?.message || "Could not check faculty availability.");
    }
  };

  const sendRequest = async () => {
    setRequestMessage("");

    try {
      await API.post("/faculty-requests", {
        ...requestForm,
        year: Number(requestForm.year),
        semester: Number(requestForm.semester),
        requesterName: user.name,
        requesterFaculty: user.facultyName
      });
      setRequestMessage("Request sent to all teacher dashboards.");
      setRequestForm((current) => ({ ...current, subject: "", reason: "" }));
      loadRequests();
    } catch (err) {
      setRequestMessage(err.response?.data?.message || "Could not send request.");
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await API.patch(`/faculty-requests/${requestId}/accept`, {
        responderName: user.name,
        responderFaculty: user.facultyName
      });
      setRequestMessage("Request accepted. The requester will see it on their dashboard.");
      loadRequests();
    } catch (err) {
      setRequestMessage(err.response?.data?.message || "Could not accept request.");
    }
  };

  const loadAttendanceTimetable = async () => {
    setAttendanceMessage("");
    setSelectedAttendanceSlot(null);
    setAttendanceStudents([]);
    setAttendanceRecords({});

    try {
      const res = await API.get("/timetable", {
        params: {
          department: attendanceForm.department,
          year: Number(attendanceForm.year),
          semester: Number(attendanceForm.semester)
        }
      });
      const selectedDay = dayFromDate(attendanceForm.attendanceDate);
      const nextSlots = (res.data.slots || []).filter((slot) => {
        return slot.subject && slot.day === selectedDay;
      });
      setAttendanceSlots(nextSlots);
      setAttendanceMessage(nextSlots.length ? "" : `No ${selectedDay || "selected day"} slots found for this class.`);
    } catch (err) {
      setAttendanceSlots([]);
      setAttendanceMessage(err.response?.data?.message || "Could not load saved timetable.");
    }
  };

  const uploadStudents = async () => {
    if (!attendanceFile) {
      setAttendanceMessage("Choose a student Excel file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", attendanceFile);
    formData.append("department", attendanceForm.department);
    formData.append("year", attendanceForm.year);
    formData.append("semester", attendanceForm.semester);

    try {
      const res = await API.post("/upload-students", formData);
      setAttendanceMessage(`Student list uploaded. ${res.data.count || 0} students saved.`);
      if (selectedAttendanceSlot) {
        await loadStudentsForSlot(selectedAttendanceSlot);
      }
    } catch (err) {
      const status = err.response?.status;
      const backendMessage = err.response?.data?.message;
      setAttendanceMessage(
        backendMessage
          || (status ? `Could not upload student list. Backend returned ${status}. Restart the backend if this continues.` : "Could not upload student list. Check that the backend is running on port 5003.")
      );
    }
  };

  const loadStudentsForSlot = async (slot) => {
    setSelectedAttendanceSlot(slot);
    setAttendanceMessage("");

    try {
      const res = await API.get("/students", {
        params: {
          department: attendanceForm.department,
          year: Number(attendanceForm.year),
          semester: Number(attendanceForm.semester)
        }
      });
      const students = res.data.students || [];
      const existing = await API.get("/attendance", {
        params: {
          department: attendanceForm.department,
          year: Number(attendanceForm.year),
          semester: Number(attendanceForm.semester),
          attendanceDate: attendanceForm.attendanceDate,
          day: slot.day,
          time: slot.time,
          subject: slot.subject
        }
      });
      const savedByStudent = new Map((existing.data.records || []).map((record) => [
        `${record.rollNumber || ""}-${record.studentName || ""}`,
        record.status
      ]));

      setAttendanceStudents(students);
      setAttendanceRecords(students.reduce((result, student) => {
        const key = `${student.rollNumber || ""}-${student.studentName || ""}`;
        result[key] = savedByStudent.get(key) || "PRESENT";
        return result;
      }, {}));
      setAttendanceMessage(students.length ? "" : "No students found. Upload the student Excel for this semester first.");
    } catch (err) {
      setAttendanceStudents([]);
      setAttendanceRecords({});
      setAttendanceMessage(err.response?.data?.message || "Could not load students for attendance.");
    }
  };

  const toggleAttendance = (student, status) => {
    const key = `${student.rollNumber || ""}-${student.studentName || ""}`;
    setAttendanceRecords((current) => ({ ...current, [key]: status }));
  };

  const saveAttendance = async () => {
    if (!selectedAttendanceSlot) {
      setAttendanceMessage("Choose a timetable slot first.");
      return;
    }

    try {
      await API.post("/attendance", {
        department: attendanceForm.department,
        year: Number(attendanceForm.year),
        semester: Number(attendanceForm.semester),
        attendanceDate: attendanceForm.attendanceDate,
        day: selectedAttendanceSlot.day,
        time: selectedAttendanceSlot.time,
        subject: selectedAttendanceSlot.subject,
        faculty: selectedAttendanceSlot.faculty,
        markedBy: user?.facultyName || user?.name,
        records: attendanceStudents.map((student) => {
          const key = `${student.rollNumber || ""}-${student.studentName || ""}`;
          return {
            rollNumber: student.rollNumber,
            studentName: student.studentName,
            status: attendanceRecords[key] || "PRESENT"
          };
        })
      });
      setAttendanceMessage("Attendance saved for this date and slot.");
    } catch (err) {
      setAttendanceMessage(err.response?.data?.message || "Could not save attendance.");
    }
  };

  useEffect(() => {
    if (activeTab === "attendance") {
      loadAttendanceTimetable();
    }
  }, [
    activeTab,
    attendanceForm.department,
    attendanceForm.year,
    attendanceForm.semester,
    attendanceForm.attendanceDate
  ]);

  const sortedSlots = [...slots].sort((left, right) => {
    return DAY_ORDER.indexOf(left.day) - DAY_ORDER.indexOf(right.day)
      || left.time.localeCompare(right.time)
      || String(left.department).localeCompare(String(right.department));
  });
  const selectedAttendanceDay = dayFromDate(attendanceForm.attendanceDate);
  const attendanceDepartments = user?.department ? [user.department] : DEPARTMENTS;

  const requestMetaFields = (
    <>
      <label className="selection-field">
        <span>Department</span>
        <select value={requestForm.department} onChange={(event) => updateRequestForm("department", event.target.value)}>
          <option value="ECS">ECS</option>
          <option value="COMP">COMP</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
          <option value="SCIENCE_HUMANITIES">Science & Humanities</option>
        </select>
      </label>
      <label className="selection-field">
        <span>Year</span>
        <select value={requestForm.year} onChange={(event) => updateRequestForm("year", event.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </label>
      <label className="selection-field">
        <span>Semester</span>
        <select value={requestForm.semester} onChange={(event) => updateRequestForm("semester", event.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>
      </label>
      <label className="selection-field">
        <span>Day</span>
        <select value={requestForm.day} onChange={(event) => updateRequestForm("day", event.target.value)}>
          {DAY_ORDER.map((day) => <option key={day} value={day}>{day}</option>)}
        </select>
      </label>
      <label className="selection-field">
        <span>Time</span>
        <select value={requestForm.time} onChange={(event) => updateRequestForm("time", event.target.value)}>
          {REQUEST_TIMES.map((time) => <option key={time} value={time}>{time}</option>)}
        </select>
      </label>
    </>
  );

  const renderTimetable = () => (
    <>
      {message && <p className="status-message">{message}</p>}
      <div className="timetable-wrap">
        <table className="timetable-table compact-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Department</th>
              <th>Year</th>
              <th>Semester</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {sortedSlots.map((slot, index) => (
              <tr key={`${slot.department}-${slot.year}-${slot.semester}-${slot.day}-${slot.time}-${index}`}>
                <td className="day-label">{slot.day}</td>
                <td>{slot.time}</td>
                <td>{slot.department}</td>
                <td>{slot.year}</td>
                <td>{slot.semester}</td>
                <td>
                  <div className="slot-subject">{slot.subject}</div>
                  <div className="slot-faculty">{slot.faculty}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderAvailability = () => (
    <>
      <div className="section-heading">
        <p className="section-kicker">Availability</p>
        <h2>Find Free Faculty</h2>
        <p className="section-copy">Pick a day and slot to see who is not busy in saved timetables.</p>
      </div>
      <div className="action-panel">{requestMetaFields}<button className="primary-button" onClick={checkAvailability}>Check Availability</button></div>
      {availabilityMessage && <p className="status-message">{availabilityMessage}</p>}
      {!!availableFaculty.length && <div className="status-message"><strong>Available Faculty:</strong> {availableFaculty.join(", ")}</div>}
    </>
  );

  const renderRequest = () => (
    <>
      <div className="section-heading">
        <p className="section-kicker">Leave / Cover Request</p>
        <h2>Ask Another Faculty To Take The Class</h2>
        <p className="section-copy">Add the exact class details so the request is clear to everyone.</p>
      </div>
      <div className="action-panel">
        {requestMetaFields}
        <label className="selection-field">
          <span>Date</span>
          <input type="date" value={requestForm.requestDate} onChange={(event) => updateRequestForm("requestDate", event.target.value)} />
        </label>
        <label className="selection-field request-field-wide">
          <span>Subject / Class</span>
          <input value={requestForm.subject} onChange={(event) => updateRequestForm("subject", event.target.value)} placeholder="Eg. Strength of Materials" />
        </label>
        <label className="selection-field request-field-wide">
          <span>Reason</span>
          <input value={requestForm.reason} onChange={(event) => updateRequestForm("reason", event.target.value)} placeholder="Eg. Leave, meeting, not available for this hour" />
        </label>
        <button className="primary-button" onClick={sendRequest}>Send Request</button>
      </div>
      {requestMessage && <p className="status-message">{requestMessage}</p>}
    </>
  );

  const renderNotifications = () => (
    <>
      <div className="section-heading">
        <p className="section-kicker">Notifications</p>
        <h2>Requests Received From Other Faculty</h2>
        <p className="section-copy">
          Sem 3-8 requests are shown only inside your department. Sem 1-2 requests are universal because first-year
          classes can be handled by the shared Science & Humanities pool.
        </p>
      </div>
      <div className="notification-toolbar">
        <button className="secondary-button" onClick={enableDesktopNotifications} disabled={notificationPermission === "granted" || notificationPermission === "unsupported"}>
          {notificationPermission === "granted" ? "Desktop Notifications On" : "Enable Desktop Notifications"}
        </button>
        <span className={`notification-pill notification-${notificationPermission}`}>
          {notificationPermission === "unsupported" ? "Not supported" : notificationPermission}
        </span>
      </div>
      {requestMessage && <p className="status-message">{requestMessage}</p>}
      <div className="summary-list">
        {openRequests.length ? openRequests.map((request) => (
          <div className="summary-row request-row" key={request.id}>
            <strong>{request.subject || "Class cover request"}</strong>
            <span>{request.department} Y{request.year || "-"} S{request.semester || "-"}</span>
            <span>{displayRequestDate(request.requestDate)} {request.day} {request.time}</span>
            <span>From {request.requesterFaculty || request.requesterName}</span>
            <span>{request.responderFaculty ? `Accepted by ${request.responderFaculty}` : displayRequestStatus(request.status)}</span>
            {request.status === "OPEN" ? (
              <button className="secondary-button" onClick={() => acceptRequest(request.id)}>Accept</button>
            ) : (
              <span className="request-accepted-label">Covered</span>
            )}
          </div>
        )) : <p className="status-message">No active requests right now.</p>}
      </div>
    </>
  );

  const renderMyRequests = () => (
    <>
      <div className="section-heading">
        <p className="section-kicker">My Requests</p>
        <h2>Requests Sent By Me</h2>
      </div>
      <div className="summary-list">
        {myRequests.length ? myRequests.map((request) => (
          <div className="summary-row" key={request.id}>
            <strong>{request.subject || "Class cover request"}</strong>
            <span>{displayRequestDate(request.requestDate)} {request.day} {request.time}</span>
            <span>{displayRequestStatus(request.status)}</span>
            <span>{request.responderFaculty ? `Accepted by ${request.responderFaculty}` : "Waiting"}</span>
          </div>
        )) : <p className="status-message">You have not sent any requests yet.</p>}
      </div>
    </>
  );

  const renderAttendance = () => (
    <>
      <div className="section-heading">
        <p className="section-kicker">Attendance</p>
        <h2>Saved Timetable Attendance</h2>
        <p className="section-copy">
          Showing {selectedAttendanceDay || "the selected day"} slots only. Choose a class slot, then mark attendance for the selected date.
        </p>
      </div>

      <div className="action-panel">
        <label className="selection-field">
          <span>Department</span>
          <select value={attendanceForm.department} onChange={(event) => updateAttendanceForm("department", event.target.value)}>
            {attendanceDepartments.map((department) => (
              <option key={department} value={department}>{department === "SCIENCE_HUMANITIES" ? "Science & Humanities" : department}</option>
            ))}
          </select>
        </label>
        <label className="selection-field">
          <span>Year</span>
          <select value={attendanceForm.year} onChange={(event) => updateAttendanceForm("year", event.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </label>
        <label className="selection-field">
          <span>Semester</span>
          <select value={attendanceForm.semester} onChange={(event) => updateAttendanceForm("semester", event.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </label>
        <label className="selection-field">
          <span>Date</span>
          <input type="date" value={attendanceForm.attendanceDate} onChange={(event) => updateAttendanceForm("attendanceDate", event.target.value)} />
        </label>
        <button className="primary-button" onClick={loadAttendanceTimetable}>Refresh Day Slots</button>
      </div>

      <div className="action-panel">
        <label className="selection-field request-field-wide">
          <span>Student Excel</span>
          <input type="file" accept=".xlsx,.xls" onChange={(event) => setAttendanceFile(event.target.files?.[0] || null)} />
        </label>
        <button className="secondary-button" onClick={uploadStudents}>Upload Student List</button>
      </div>

      {attendanceMessage && <p className="status-message">{attendanceMessage}</p>}

      {!!attendanceSlots.length && (
        <div className="summary-list attendance-slot-list">
          {attendanceSlots.map((slot, index) => (
            <div
              className={`summary-row attendance-slot-button ${selectedAttendanceSlot === slot ? "active" : ""}`}
              key={`${slot.day}-${slot.time}-${slot.subject}-${index}`}
            >
              <strong>{slot.subject}</strong>
              <span>{slot.time}</span>
              <span>{slot.faculty || "Faculty not set"}</span>
              <span>{slot.day}</span>
              <button className="secondary-button attendance-action" onClick={() => loadStudentsForSlot(slot)}>Take Attendance</button>
            </div>
          ))}
        </div>
      )}

      {!!attendanceStudents.length && selectedAttendanceSlot && (
        <div className="attendance-panel">
          <div className="section-heading section-heading-row">
            <div>
              <p className="section-kicker">{selectedAttendanceSlot.day} {selectedAttendanceSlot.time}</p>
              <h2>{selectedAttendanceSlot.subject}</h2>
              <p className="section-copy">Mark students present or absent for {attendanceForm.attendanceDate}.</p>
            </div>
            <button className="primary-button" onClick={saveAttendance}>Save Attendance</button>
          </div>

          <div className="summary-list">
            {attendanceStudents.map((student) => {
              const key = `${student.rollNumber || ""}-${student.studentName || ""}`;
              return (
                <div className="summary-row attendance-row" key={key}>
                  <strong>{student.rollNumber || "-"}</strong>
                  <span>{student.studentName}</span>
                  <select value={attendanceRecords[key] || "PRESENT"} onChange={(event) => toggleAttendance(student, event.target.value)}>
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );

  const renderActiveTab = () => {
    if (activeTab === "attendance") return renderAttendance();
    if (activeTab === "availability") return renderAvailability();
    if (activeTab === "request") return renderRequest();
    if (activeTab === "notifications") return renderNotifications();
    if (activeTab === "mine") return renderMyRequests();
    return renderTimetable();
  };

  return (
    <div className="page-section">
      <div className="section-heading section-heading-row">
        <div>
          <p className="section-kicker">Teacher View</p>
          <h2>{user?.facultyName || user?.name}'s Workspace</h2>
          <p className="section-copy">View classes, check faculty availability, and manage leave or substitution requests.</p>
        </div>
        <button className="secondary-button" onClick={() => {
          loadTeacherTimetable();
          loadRequests();
        }}>
          Refresh
        </button>
      </div>

      <section className="teacher-tab-panel">
        {renderActiveTab()}
      </section>
    </div>
  );
}

export default TeacherTimetable;
