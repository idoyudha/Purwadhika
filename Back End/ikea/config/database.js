const mysql = require('mysql')
const util = require('util')

const db = mysql.createPool ({
    host: process.env.HOSTSQL,
    user: process.env.USERSQL,
    password: process.env.PASSWORD,
    database: process.env.DBSQL,
    port: process.env.PORTSQL,
    multipleStatements: true
})

const dbQuery = util.promisify(db.query).bind(db)


module.exports = { db, dbQuery }