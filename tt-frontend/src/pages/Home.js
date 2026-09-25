import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/home.css";

function Home({ user, setPage, academicYear }) {
  const [saved, setSaved] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/saved-timetables", { params: { academicYear } })
      .then((res) => setSaved(res.data.timetables || []))
      .catch(() => setMessage("Could not load saved timetable summary."));

    if (user?.role === "admin") {
      API.get("/auth/credentials")
        .then((res) => setCredentials(res.data.credentials || []))
        .catch(() => {});
    }
  }, [user, academicYear]);

  return (
    <div className="home-container">
      <div className="dashboard-overview">
        <div>
          <p className="section-kicker">Overview</p>
          <h1 className="welcome-text">Welcome, {user?.name}</h1>
          <p className="section-copy">
            Manage load sheets, generate clash-aware schedules, review saved timetables, and export approved grids.
          </p>
        </div>
        <div className="overview-stats">
          <div>
            <strong>{saved.length}</strong>
            <span>Saved timetables ({academicYear})</span>
          </div>
          {user?.role === "admin" && (
            <div>
              <strong>{credentials.length || "-"}</strong>
              <span>User accounts</span>
            </div>
          )}
        </div>
      </div>

      {message && <p className="status-message">{message}</p>}

      <div className="dashboard-grid">
        <button className="dashboard-card" onClick={() => setPage("upload")}>
          <span>01</span>
          <strong>Upload Loadsheet</strong>
          <p>Add Excel subject loads department-wise.</p>
        </button>
        <button className="dashboard-card" onClick={() => setPage("generate")}>
          <span>02</span>
          <strong>Generate & Save</strong>
          <p>Preview the timetable, then save only when approved.</p>
        </button>
        <button className="dashboard-card" onClick={() => setPage("view")}>
          <span>03</span>
          <strong>View & Export</strong>
          <p>Review saved grids and export them to Excel.</p>
        </button>
      </div>

      <div className="page-section">
        <div className="section-heading">
          <p className="section-kicker">Saved Timetables</p>
          <h2>Saved Schedule Summary · {academicYear}</h2>
        </div>

        <div className="summary-list">
          {saved.length ? saved.map((item) => (
            <div className="summary-row" key={`${item.academicYear}-${item.department}-${item.year}-${item.semester}`}>
              <strong>{item.department}</strong>
              <span>Year {item.year}, Semester {item.semester}</span>
              <span>{item.slotCount} saved slots</span>
            </div>
          )) : <p className="status-message">No saved timetables for {academicYear} yet.</p>}
        </div>
      </div>

      {user?.role === "admin" && (
        <div className="page-section">
          <div className="section-heading">
            <p className="section-kicker">Access Control</p>
            <h2>User Accounts</h2>
            <p className="section-copy">
              Teacher accounts are created automatically from faculty names already present in the database. Login
              details are kept outside the dashboard for privacy.
            </p>
          </div>

          <div className="summary-list">
            <div className="summary-row">
              <strong>{credentials.length} accounts ready</strong>
              <span>{credentials.filter((account) => account.role === "admin").length} admin</span>
              <span>{credentials.filter((account) => account.role === "teacher").length} teachers</span>
              <span>{credentials.filter((account) => account.role === "student").length} students</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
