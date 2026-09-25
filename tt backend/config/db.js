const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345678",
  database: process.env.DB_NAME || "timetable",
  port: Number(process.env.DB_PORT) || 3306
});

console.log("✅ MySQL Pool Ready");

module.exports = db;
