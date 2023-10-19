var mysql = require("mysql")

require("dotenv").config({ path: "../.env" })

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  database: "opentutorials",
})

db.connect()

module.exports = db
