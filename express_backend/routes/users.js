const express = require('express');
const router = express.Router();
const mailgun = require("mailgun-js");
require('dotenv').config();

const {getProductByVendor} = require('../helpers/dataHelpers');

const DOMAIN = `${process.env.DOMAIN}`;
const api_key = `${process.env.API_KEY}`;
const mg = mailgun({
  apiKey: api_key, 
  domain: DOMAIN
});

/* To send email notifications */
const sendEmail = (firstName, email) => {
  const data = {
    from: 'noreply@allgoodservices.com',
    to: email,
    subject: 'Thanks for joining All Good',
    html:`<html><p><b>Hello ${firstName},</b></p></br><p>Thanks for joining All Good.</p></br><p>Your application has been submitted for review.</p></br><p>We will get in touch with you shortly.</p></br><p>Thank you,</p></br><p><b>the All Good team</b></p></html>`
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
}

module.exports = ({ getUsers, getProducts, getVendorByEmail, addVendor }) => {

  /* GET users listing. */
  router.get('/', function(req, res) {
    getUsers()
      .then(users => res.json(users))
      .catch(err => res.json({ msg: err.message }))
  });
  
  /* GET vendor products */
  router.get('/products', function(req, res) {
    getProducts()
      .then(vendorProducts => {
        const formattedProducts = getProductByVendor(vendorProducts);
        res.json(formattedProducts);
      })
      .catch(err => res.json({ msg: err.message }))
  });

  /* INSERT new vendors*/
  router.post('/', (req, res) => {
    const {
      firstName, 
      lastName, 
      company, 
      title, 
      email, 
      phone, 
      companyUrl, 
      contactMethod, 
      handle, 
      description, 
      comments, 
      stageId, 
      reviewerId
    } = req.body;

    getVendorByEmail(email)
      .then(vendor => {
        if(vendor) {
          res.json({
            msg: 'Sorry, a user account with this email already exists'
          });
        } else {
          sendEmail(firstName, email);
          return addVendor(firstName, 
            lastName, 
            company, 
            title, 
            email, 
            phone, 
            companyUrl, 
            contactMethod, 
            handle, 
            description, 
            comments, 
            stageId, 
            reviewerId)
        }
      })
      .then(newVendor => res.json(newVendor))
      .catch(err => res.json({
        error: err.message
      }));
  })
 return router;
}

