const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const billMail = async (email, name , bill ) => {
  try {
    let mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    })
    
    const handlebarOptions = {
      viewEngine: {
        extName: '.handlebars',
        partialsDir: './src/utils/',
        defaultLayout: false,
      },
      viewPath: './src/utils/',
      extName: '.hbs',
    }
    mailTransporter.use('compile', hbs(handlebarOptions))
    let mailDetails = {
      from: process.env.EMAIL,
      to: `${email}`,
      subject: 'Bill payment',
      template: 'password',
      context: {
        name: name,
        bill:bill,
      },
    }
    
    mailTransporter.billMail(mailDetails, function (err, data) {
      if (err) {
        console.log('Error Occurs', err)
      }else {
        console.log('Email sent successfully', data)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {billMail}