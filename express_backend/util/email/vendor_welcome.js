const vendor_welcome = (mg, firstName, email) => {
  const data = {
    from: 'noreply@allgoodservices.com',
    to: email,
    subject: 'Response from All Good Team',
    html: `<html>
    <p>
    <b>Hello ${firstName},</b></br>
    </p>
    <p>Thanks for joining All Good.</p></br>
    <p>Your application has been submitted for review.</p></br>
    <p>We will get in touch with you shortly.</p></br>
    <p>Thank you,</p>
    <p>
    <b>The All Good team</b></br>
    </p>
    </html>`
  }
  mg.messages().send(data, function (error, body) {
    console.log(body);
  }); 
};

module.exports = { vendor_welcome };