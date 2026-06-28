import React, { useEffect, useState } from "react";
<<<<<<< HEAD
=======
import Calendar from "./pages/Calendar";
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)

import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Generate from "./pages/Generate";
import ViewTimetable from "./pages/ViewTimetable";
import TeacherTimetable from "./pages/TeacherTimetable";

import "./styles/layout.css";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("tt-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
<<<<<<< HEAD
=======

>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
  const [page, setPage] = useState("home");
  const [department, setDepartment] = useState("ECS");
  const [year, setYear] = useState("2");
  const [semester, setSemester] = useState("3");
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    if (!user) return;

    if (user.role === "teacher") {
      setPage("teacher-timetable");
      return;
    }

    if (user.role === "student") {
      setPage("view");
    }
  }, [user]);

  useEffect(() => {
    if (department === "SCIENCE_HUMANITIES") {
      setDepartment("ECS");
    }
  }, [department]);

  const login = (nextUser) => {
    localStorage.setItem("tt-user", JSON.stringify(nextUser));
    setUser(nextUser);
    setDepartment(nextUser.department || "ECS");
  };

  const logout = () => {
    localStorage.removeItem("tt-user");
    setUser(null);
    setPage("home");
  };

  if (!user) {
    return <Login onLogin={login} />;
  }

  const role = user.role;

  const renderPage = () => {
<<<<<<< HEAD
    if (role === "teacher") {
      return <TeacherTimetable user={user} activeTab={page.replace("teacher-", "")} />;
    }

    if (page === "home") return <Home user={user} setPage={setPage} />;
    if (role === "admin" && page === "upload") {
      return <Upload department={department} year={year} semester={semester} />;
    }
=======
    if (page === "calendar") {
      return <Calendar />;
    }

    if (role === "teacher") {
      return (
        <TeacherTimetable
          user={user}
          activeTab={page.replace("teacher-", "")}
        />
      );
    }

    if (page === "home") {
      return <Home user={user} setPage={setPage} />;
    }

    if (role === "admin" && page === "upload") {
      return (
        <Upload
          department={department}
          year={year}
          semester={semester}
        />
      );
    }

>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
    if (role === "admin" && page === "generate") {
      return (
        <Generate
          department={department}
          year={year}
          semester={semester}
          onGenerated={() => {
            setRefreshToken((value) => value + 1);
            setPage("view");
          }}
        />
      );
    }
<<<<<<< HEAD
=======

>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
    if (page === "view") {
      return (
        <ViewTimetable
          department={department}
          year={year}
          semester={semester}
          refreshToken={refreshToken}
          onRefresh={() => setRefreshToken((value) => value + 1)}
          canEdit={role === "admin"}
          canExport={role === "admin"}
        />
      );
    }

    return <Home user={user} setPage={setPage} />;
  };

  return (
    <div className="app-layout">
<<<<<<< HEAD
      <Sidebar setPage={setPage} user={user} onLogout={logout} page={page} />
=======
      <Sidebar
        setPage={setPage}
        user={user}
        onLogout={logout}
        page={page}
      />

>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
      <div className="main-content">
        <div className="page-shell">
          <div className="topbar">
            <div>
              <p className="eyebrow">{role} dashboard</p>
<<<<<<< HEAD
              <h1 className="page-title">Academic Timetable Generation and Management System</h1>
=======
              <h1 className="page-title">
                Academic Timetable Generation and Management System
              </h1>
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
              <p className="dashboard-date">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                })}
              </p>
            </div>

            {role !== "teacher" && (
              <div className="selection-panel">
                <label className="selection-field">
                  <span>Department</span>
<<<<<<< HEAD
                  <select value={department} onChange={(e) => setDepartment(e.target.value)}>
=======
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
                    <option value="ECS">ECS</option>
                    <option value="COMP">COMP</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </label>

                <label className="selection-field">
                  <span>Year</span>
<<<<<<< HEAD
                  <select value={year} onChange={(e) => setYear(e.target.value)}>
=======
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </label>

                <label className="selection-field">
                  <span>Semester</span>
<<<<<<< HEAD
                  <select value={semester} onChange={(e) => setSemester(e.target.value)}>
=======
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
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
              </div>
            )}
          </div>

          <div className="content-card">
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
