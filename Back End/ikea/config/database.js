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

// db.getConnection(( error, connection ) => {
//     if (error) {
//         return console.error('error MySQL: ', error.message)
//     }
//     console.log(`Connected to MySQL Server : ${connection.threadId}`)
// })

module.exports = { db, dbQuery }