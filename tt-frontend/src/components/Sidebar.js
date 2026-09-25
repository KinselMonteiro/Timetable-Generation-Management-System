import React from "react";

function Sidebar({ setPage, user, onLogout, page }) {
  const role = user?.role || "student";

  const items =
    role === "admin"
      ? [
          { id: "home", label: "Dashboard" },
          { id: "upload", label: "Upload" },
          { id: "generate", label: "Generate" },
          { id: "view", label: "View Timetable" },
          { id: "calendar", label: "Calendar" }
        ]
      : role === "teacher"
      ? [
          { id: "teacher-timetable", label: "My Timetable" },
          { id: "teacher-attendance", label: "Attendance" },
          { id: "teacher-availability", label: "Free Faculty" },
          { id: "teacher-request", label: "Send Request" },
          { id: "teacher-notifications", label: "Requests Received" },
          { id: "teacher-mine", label: "Requests Sent" },
          { id: "calendar", label: "Calendar" }
        ]
      : [
          { id: "view", label: "View Timetable" },
          { id: "calendar", label: "Calendar" }
        ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <p className="sidebar-kicker">DBCE ECS</p>
        <h2>Timetable Hub</h2>
        <p className="sidebar-copy">
          Manage saved schedules with role-based access for admins, teachers, and students.
        </p>
      </div>

      <div className="user-chip">
        <strong>{user?.name}</strong>
        <span>{role}</span>
      </div>

      <div className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.id}
            className={`sidebar-button ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            {item.label}
          </button>
        ))}

        <button className="sidebar-button sidebar-button-muted" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
