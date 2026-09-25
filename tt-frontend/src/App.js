import React, { useEffect, useState } from "react";
import Calendar from "./pages/Calendar";

import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Generate from "./pages/Generate";
import ViewTimetable from "./pages/ViewTimetable";
import TeacherTimetable from "./pages/TeacherTimetable";
import API from "./services/api";
import { getCurrentAcademicYear } from "./utils/academicYear";

import "./styles/layout.css";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("tt-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [page, setPage] = useState("home");
  const [department, setDepartment] = useState("ECS");
  const [year, setYear] = useState("2");
  const [semester, setSemester] = useState("3");
  const [refreshToken, setRefreshToken] = useState(0);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(getCurrentAcademicYear);
  const [academicYear, setAcademicYear] = useState(getCurrentAcademicYear);
  const [academicYears, setAcademicYears] = useState(() => [getCurrentAcademicYear()]);

  useEffect(() => {
    if (!user) return;

    API.get("/academic-years")
      .then((res) => {
        if (res.data.current) setCurrentAcademicYear(res.data.current);
        if (res.data.years?.length) setAcademicYears(res.data.years);
      })
      .catch(() => {});
  }, [user, refreshToken]);

  useEffect(() => {
    // Only admins can browse other years; teachers and students always see the current one.
    if (user && user.role !== "admin") {
      setAcademicYear(currentAcademicYear);
    }
  }, [user, currentAcademicYear]);

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
    setAcademicYear(currentAcademicYear);
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
  const isMasters = ["ME_CIVIL", "ME_DATA_SCIENCE"].includes(department);

  const renderPage = () => {
    if (page === "calendar") {
      return <Calendar />;
    }

    if (role === "teacher") {
      return (
        <TeacherTimetable
          user={user}
          academicYear={academicYear}
          activeTab={page.replace("teacher-", "")}
        />
      );
    }

    if (page === "home") {
      return <Home user={user} setPage={setPage} academicYear={academicYear} />;
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

    if (role === "admin" && page === "generate") {
      return (
        <Generate
          academicYear={academicYear}
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

    if (page === "view") {
      return (
        <ViewTimetable
          academicYear={academicYear}
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

    return <Home user={user} setPage={setPage} academicYear={academicYear} />;
  };

  return (
    <div className="app-layout">
      <Sidebar
        setPage={setPage}
        user={user}
        onLogout={logout}
        page={page}
      />

      <div className="main-content">
        <div className="page-shell">
          <div className="topbar">
            <div>
              <p className="eyebrow">{role} dashboard</p>
              <h1 className="page-title">
                Academic Timetable Generation and Management System
              </h1>
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
                  <span>Academic Year</span>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    disabled={role !== "admin"}
                  >
                    {(role === "admin" ? academicYears : [academicYear]).map((option) => (
                      <option key={option} value={option}>
                        {option}
                        {option === currentAcademicYear ? " (current)" : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="selection-field">
                  <span>Program / Department</span>
                  <select
                    value={department}
                    onChange={(e) => {
                      const selectedDepartment = e.target.value;
                      setDepartment(selectedDepartment);
                      if (["ME_CIVIL", "ME_DATA_SCIENCE"].includes(selectedDepartment)) {
                        setYear("1");
                        setSemester("1");
                      }
                    }}
                  >
                    <option value="ECS">ECS</option>
                    <option value="COMP1">COMP 1</option>
                    <option value="COMP2">COMP 2</option>
                    <option value="COMP">COMP (existing timetables)</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="ME_CIVIL">M.E. Civil</option>
                    <option value="ME_DATA_SCIENCE">M.E. Data Science</option>
                  </select>
                </label>

                <label className="selection-field">
                  <span>Year</span>
                  <select
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                      if (isMasters) setSemester(String(2 * Number(e.target.value) - 1));
                    }}
                  >
                    {(isMasters ? [1, 2] : [1, 2, 3, 4]).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="selection-field">
                  <span>Semester</span>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    {(isMasters ? [2 * Number(year) - 1, 2 * Number(year)] : [1, 2, 3, 4, 5, 6, 7, 8]).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
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

export default App;
