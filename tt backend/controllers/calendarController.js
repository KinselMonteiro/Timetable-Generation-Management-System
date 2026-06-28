const db = require("../config/db");

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function isAdmin(req) {
  return String(req.headers["x-user-role"] || "").toLowerCase() === "admin";
}

exports.getCalendarEvents = async (req, res) => {
  try {
    const department = String(req.query.department || "ALL").toUpperCase();

    const rows = await query(
      `SELECT * FROM calendar_events
       WHERE department = 'ALL' OR department = ?
       ORDER BY event_date ASC`,
      [department]
    );

    res.json({ success: true, events: rows });
  } catch (err) {
    console.error("CALENDAR GET ERROR:", err);
    res.status(500).json({ success: false, message: "Could not load calendar events" });
  }
};

exports.addCalendarEvent = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ success: false, message: "Only admin can add events" });
    }

    const {
      title,
      description,
      event_date,
      department,
      event_type,
      created_by
    } = req.body;

    await query(
      `INSERT INTO calendar_events
       (title, description, event_date, department, event_type, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        event_date,
        department || "ALL",
        event_type || "GENERAL",
        created_by || "Admin"
      ]
    );

    res.json({ success: true, message: "Event added" });
  } catch (err) {
    console.error("CALENDAR ADD ERROR:", err);
    res.status(500).json({ success: false, message: "Could not add event" });
  }
};

exports.deleteCalendarEvent = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ success: false, message: "Only admin can delete events" });
    }

    await query("DELETE FROM calendar_events WHERE id = ?", [req.params.id]);

    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    console.error("CALENDAR DELETE ERROR:", err);
    res.status(500).json({ success: false, message: "Could not delete event" });
  }
};