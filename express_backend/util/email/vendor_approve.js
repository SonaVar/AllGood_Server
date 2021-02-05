const path = require('path');

const filepath1 = path.join(__dirname, '../../docs/fruit.jpg');
const filepath2 = path.join(__dirname, '../../docs/test.docx');


const vendor_approve = (mg, email, url) => {
  const data = {
    from: 'noreply@allgoodservices.com',
    to: email,
    subject: 'Congratulations! Your application has been approved',
    html: `<html>
    <p>Thanks for your interest in joining All Good.</p></br>
    <p>Your application has been approved</p></br>
    <p>For further processing, we require you to carefully read through the attached documents and upload them in the link provided below: </p></br>
    <a href="${url}">Upload document here!</a></br>
    <p>Thank you,</p>
    <p>
    <b>The All Good team</b></br>
    </p>
    </html>`,
    attachment: [filepath1, filepath2]
  }
  mg.messages().send(data, function (error, body) {
    console.log(body);
  }); 

}

module.exports = { vendor_approve };