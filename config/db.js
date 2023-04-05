const mysql = require("mysql");
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "apotekku",
  multipleStatements: true,
});

pool.query("SELECT 1", function (error) {
  if (error) throw error;
  console.log("Database is connected");
});

module.exports = pool;
