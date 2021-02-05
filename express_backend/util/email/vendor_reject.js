const vendor_reject = (mg, email) => {
  console.log('Inside vendor reject!')
  
  const data = {
    from: 'noreply@allgoodservices.com',
    to: email,
    subject: 'Your application has been rejected',
    html: `<html>
    <p>Thanks for your interest in joining All Good.</p></br>
    <p>Your application could not be processed due to failed background verification.</p></br>
    <p>Please email the below customer care support line for further inquiry: </p></br>
    <p>info@allgoodservices.com</p></br>
    <p>Thank you,</p>
    <p>
    <b>The All Good team</b></br>
    </p>
    </html>`
  }
  mg.messages().send(data, function (error, body) {
    console.log(body);
  }); 

}

module.exports = { vendor_reject };