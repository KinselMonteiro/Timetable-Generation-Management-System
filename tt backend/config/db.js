const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
<<<<<<< HEAD
  password: "12345",
  database: "timetable_db"
=======
  password: "12345678",
  database: "timetable"
>>>>>>> b3c2ef3 (Update calendar and faculty timetable modules)
});

console.log("✅ MySQL Pool Ready");

module.exports = db;
