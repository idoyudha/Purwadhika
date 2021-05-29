const mysql = require('mysql')
const util = require('util')

const db = mysql.createPool ({
    host: 'localhost',
    user: 'ido',
    password: 'mysql75@',
    database: 'db_ikea',
    port: 3306,
    multipleStatements: true
})

const dbQuery = util.promisify(db.query).bind(db)


module.exports = { db, dbQuery }