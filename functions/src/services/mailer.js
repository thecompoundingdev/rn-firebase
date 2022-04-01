const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

exports.triggerMail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `Jane Doe <janedoe@gmail.com>`,
      to,
      subject,
      text,
      html,
    };

    // await transporter.sendMail(mailOptions);
    return true;
  } catch (ex) {
    console.log('========= failed to trigger email =============');
    console.log(ex.message);
    return false;
  }
};
