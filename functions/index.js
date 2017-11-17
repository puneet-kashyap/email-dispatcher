const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp(functions.config().firebase);

var mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: functions.config().email.id,
      pass: functions.config().email.pass
    }
  });

  function sendBookingEmail(email, form) {
    const mailOptions = {
      from: `Dilshaan <noreply@dilshaan.com>`,
      to: email
    };

    mailOptions.subject = `Welcome to Dilshaan Fan club!`;
    mailOptions.text = `
    Hey Dilshaan!

    A prospective client has requested to book your show.
    Please check the details below to follow up:

    Name:       ${form.name || ''}
    Phone:      ${form.phone || ''}
    Email:      ${form.email || ''}
    Date:       ${form.date || ''}
    Time:       ${form.time || ''}
    Comments:   ${form.comments || ''}

    Cya in your next show.

    Enjoy,
    Dilshaan's Fan Club.`;
    return mailTransport.sendMail(mailOptions).then(() => {
      console.log('New booking email sent to:', email);
    });
  }

exports.sendBookingInfo = functions.database.ref('/Inquiry/{name}').onCreate(event => {
    console.log('New Entry added');
    const original = event.data.val();
    console.log('Values', original);
    sendBookingEmail(functions.config().email.recipient,original);
})