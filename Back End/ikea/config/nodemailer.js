// zpohklwftsfxsdvh
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:'gmail', 
    auth:{
        user: 'yudhatama1123@gmail.com',
        pass: 'zpohklwftsfxsdvh'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = {transporter}