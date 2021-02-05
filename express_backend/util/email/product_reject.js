const product_reject = (mg, email, url, feedback) => {

  const data = {
    from: 'noreply@allgoodservices.com',
    to: email,
    subject: 'Your product has been rejected',
    html: `<html>
    <p>Thanks for your interest in joining All Good!</p></br>
    <p>Unfortunately, your product could not be accepted due to the following reason: </p></br>
    <p><b>"${feedback}"</b></p></br>
    <p>Please login to your account using the following link and make the necessary changes for further review: </p></br>
    <a href=${url}>Login to my Allgood account</a></br>
    <p>For any further queries, please email the below customer care support line: </p></br>
    <p>info@allgoodservices.com</p></br>
    <p>Thank you,</p>
    <p><b>The All Good team</b></p>
    </html>`
  }
  mg.messages().send(data, function (error, body) {
    console.log(body);
  }); 

}

module.exports = { product_reject };