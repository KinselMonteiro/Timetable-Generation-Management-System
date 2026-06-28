import React, { useEffect, useState } from "react";
import axios from "axios";

function Calendar() {
  const user = JSON.parse(localStorage.getItem("tt-user") || "{}");
  const isAdmin = String(user.role || "").toLowerCase() === "admin";

  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    department: "ALL",
    event_type: "GENERAL"
  });

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const loadEvents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5003/api/calendar",
        {
          params: {
            department: user.department || "ALL"
          }
        }
      );

      const allEvents = res.data.events || [];

      setEvents(allEvents);

      const today = new Date();

      const upcoming = allEvents.filter((event) => {
        const eventDate = new Date(event.event_date);

        const diff =
          (eventDate - today) /
          (1000 * 60 * 60 * 24);

        return diff >= 0 && diff <= 3;
      });

      setUpcomingEvents(upcoming);
    } catch (err) {
      console.error("Load calendar error:", err);
      alert("Could not load calendar events");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const addEvent = async (e) => {
    e.preventDefault();

    try {
      console.log("User Object:", user);
      console.log("Role Being Sent:", user.role);
      await axios.post(
        "http://localhost:5003/api/calendar",
        {
          ...form,
          created_by: user.name || "Admin"
        },
        {
          headers: {
            "x-user-role": user.role
          }
        }
      );

      alert("Event added successfully");

      setForm({
        title: "",
        description: "",
        event_date: "",
        department: "ALL",
        event_type: "GENERAL"
      });

      loadEvents();
    } catch (err) {
      console.error("Add event error:", err);
      alert("Only admin can add events");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await axios.delete(
        `http://localhost:5003/api/calendar/${id}`,
        {
          headers: {
            "x-user-role": user.role
          }
        }
      );

      loadEvents();
    } catch (err) {
      console.error("Delete event error:", err);
      alert("Only admin can delete events");
    }
  };

  const goPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDateKey = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const eventsForDate = (dateObj) => {
    const key = getDateKey(dateObj);

    return events.filter((event) => {
      const matchesDate =
        String(event.event_date).slice(0, 10) === key;

      const matchesSearch =
        event.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (event.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesDate && matchesSearch;
    });
  };

  const buildCalendarDays = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  };

  const getEventColor = (type) => {
    switch (type) {
      case "HOLIDAY":
        return "#ffd6d6";

      case "EXAM":
        return "#ffe8b3";

      case "EVENT":
        return "#d4edda";

      case "NOTICE":
        return "#fff3cd";

      default:
        return "#dbeafe";
    }
  };

  const calendarDays = buildCalendarDays();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Academic Calendar</h2>

      {/* Stats */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "10px",
          marginBottom: "20px"
        }}
      >
        <div
          style={{
            background: "#f3f4f6",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          Total Events: {events.length}
        </div>

        <div
          style={{
            background: "#ffe8b3",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          Exams: {
            events.filter(
              (e) => e.event_type === "EXAM"
            ).length
          }
        </div>

        <div
          style={{
            background: "#ffd6d6",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          Holidays: {
            events.filter(
              (e) => e.event_type === "HOLIDAY"
            ).length
          }
        </div>

        <div
          style={{
            background: "#fff3cd",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          Notices: {
            events.filter(
              (e) => e.event_type === "NOTICE"
            ).length
          }
        </div>
      </div>

      {/* Upcoming Events */}

      {upcomingEvents.length > 0 && (
        <div
          style={{
            background: "#fff3cd",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "20px"
          }}
        >
          <strong>Upcoming Events (Next 3 Days)</strong>

          {upcomingEvents.map((event) => (
            <div key={event.id}>
              • {event.title} (
              {new Date(
                event.event_date
              ).toLocaleDateString("en-IN")}
              )
            </div>
          ))}
        </div>
      )}

      {/* Admin Form */}

      {isAdmin && (
        <form
          onSubmit={addEvent}
          style={{
            display: "grid",
            gap: "10px",
            gridTemplateColumns: "1fr 1fr",
            marginBottom: "25px"
          }}
        >
          <input
            type="text"
            placeholder="Event title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value
              })
            }
            required
          />

          <input
            type="date"
            value={form.event_date}
            onChange={(e) =>
              setForm({
                ...form,
                event_date: e.target.value
              })
            }
            required
          />

          <select
            value={form.department}
            onChange={(e) =>
              setForm({
                ...form,
                department: e.target.value
              })
            }
          >
            <option value="ALL">All Departments</option>
            <option value="ECS">ECS</option>
            <option value="COMP">COMP</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
            <option value="SCIENCE AND HUMANITIES">
              Science and Humanities
            </option>
          </select>

          <select
            value={form.event_type}
            onChange={(e) =>
              setForm({
                ...form,
                event_type: e.target.value
              })
            }
          >
            <option value="GENERAL">General</option>
            <option value="HOLIDAY">Holiday</option>
            <option value="EXAM">Exam</option>
            <option value="EVENT">Event</option>
            <option value="NOTICE">Notice</option>
          </select>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value
              })
            }
            style={{ gridColumn: "1 / 3" }}
          />

          <button
            type="submit"
            style={{ gridColumn: "1 / 3" }}
          >
            Add Event
          </button>
        </form>
      )}

      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px"
        }}
      >
        <button onClick={goPrevMonth}>
          Previous
        </button>

        <h3>
          {currentDate.toLocaleString("en-IN", {
            month: "long",
            year: "numeric"
          })}
        </h3>

        <button onClick={goNextMonth}>
          Next
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(7, 1fr)",
          gap: "8px"
        }}
      >
        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat"
        ].map((day) => (
          <div
            key={day}
            style={{
              fontWeight: "bold",
              textAlign: "center",
              padding: "10px",
              background: "#f2f2f2"
            }}
          >
            {day}
          </div>
        ))}

        {calendarDays.map((dateObj, index) => {
          if (!dateObj) {
            return (
              <div
                key={`empty-${index}`}
              />
            );
          }

          const dayEvents =
            eventsForDate(dateObj);

          return (
            <div
              key={getDateKey(dateObj)}
              style={{
                minHeight: "120px",
                border:
                  "1px solid #ccc",
                borderRadius: "8px",
                padding: "8px",
                background:
                  dayEvents.length
                    ? "#fafafa"
                    : "#fff"
              }}
            >
              <strong>
                {dateObj.getDate()}
              </strong>

              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() =>
                    setSelectedEvent(
                      event
                    )
                  }
                  style={{
                    marginTop: "6px",
                    padding: "5px",
                    borderRadius: "6px",
                    background:
                      getEventColor(
                        event.event_type
                      ),
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  <b>{event.title}</b>

                  <br />

                  {event.event_type}

                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEvent(
                          event.id
                        );
                      }}
                      style={{
                        display:
                          "block",
                        marginTop:
                          "5px",
                        fontSize:
                          "11px"
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {selectedEvent && (
        <div
          onClick={() =>
            setSelectedEvent(null)
          }
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999
          }}
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "400px"
            }}
          >
            <h3>
              {selectedEvent.title}
            </h3>

            <p>
              <b>Type:</b>{" "}
              {selectedEvent.event_type}
            </p>

            <p>
              <b>Department:</b>{" "}
              {selectedEvent.department}
            </p>

            <p>
              <b>Date:</b>{" "}
              {new Date(
                selectedEvent.event_date
              ).toLocaleDateString(
                "en-IN"
              )}
            </p>

            <p>
              <b>Description:</b>
            </p>

            <p>
              {selectedEvent.description}
            </p>

            <button
              onClick={() =>
                setSelectedEvent(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;