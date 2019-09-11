const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// Init Express
const app = express();

// Template Engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.render('contact', {layout: false});
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.firstname} ${req.body.lastname}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone number: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
  const useremail = req.body.email;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.miqanews.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user:  'test@miqanews.com', // generated ethereal user
            pass: 'D_Fx)ECrqes@' // generated ethereal password
        },
        tls:{
          rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let MailOptions = {
        from: '"LotusHub Contact 📞 "<mail@no-reply>', // sender address
        to: `${req.body.email}`, // list of receivers
        subject: 'Node Contact Request ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    transporter.sendMail(MailOptions, (error, info) => {
      if(error){
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {
        layout: false,
        msg: 'Email has been sent successfully...'
      });
      console.log(req.body);
    });
});

module.exports = app;
