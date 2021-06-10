const database = require('./database')
const nodemailer = require('./nodemailer')
const token = require('./token')

module.exports = ({
    ...database, ...nodemailer, ...token
})