require('dotenv').config()
const Email = require('email-templates');
const userConfig = require('./public/configs/user.json');


let SendEmail = async function SendEmail(data) {
    const email = new Email({
    preview: false, 
    message: {
      from: 'support@yourclg.com'
    },
    send: true,
    transport: {
      host: 'smtp.office365.com',
      port: 587,
      ssl: false,
      tls: {
          ciphers: 'SSLv3'
      },
      auth: {
        user: 'support@yourclg.com', // your Mailtrap username
        pass: process.env.EMAIL_PASS
      }
    }
    });

    
      email.send({
          template: 'welcome',
          message: {
            to: data.office_user
          },
          locals: {data: data, config: userConfig}
      })
      .then(() => {
        console.log('Success')
      })
      .catch((err) => {
        console.log(err)
      })

      email.send({
        template: 'welcome',
        message: {
          to: 'itsupport@consumerlaw.com'
        },
          locals: {data: data, config: userConfig}
      })
      .then(() => {
        console.log('Success')
      })
      .catch((err) => {
        console.log(err)
      })

}

module.exports = SendEmail;