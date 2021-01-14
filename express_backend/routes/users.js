const express = require('express');
const router = express.Router();
const mailgun = require("mailgun-js");
require('dotenv').config();

const {getProductByVendor} = require('../helpers/dataHelpers');
const {vendor_welcome} = require('../util/email/vendor_welcome');
//const {vendor_product} = require('../util/email/vendor_product');

const DOMAIN = `${process.env.DOMAIN}`;
const api_key = `${process.env.API_KEY}`;
const mg = mailgun({
  apiKey: api_key, 
  domain: DOMAIN
});

/* To send email notifications */
const sendEmail = (item, email, callback) => {
  const data = {
    from: 'noreply@allgoodservices.com',
    to: email,
    subject: 'Response from All Good Team',
    html:`${callback(item)}`
  }
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
}

module.exports = ({ getUsers, getProducts, getVendorByEmail, addVendor, getVendorIDByEmail, updateProduct, deleteProduct }) => {

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
          sendEmail(firstName, email, vendor_welcome);
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

  /* INSERT new products*/
  // router.post('/products', (req, res) => {
  //   const {
  //     product_name, 
  //     upc, 
  //     ingredient, 
  //     wholesale_price, 
  //     retail_price, 
  //     height, 
  //     length, 
  //     width, 
  //     weight, 
  //     inventory_threshold, 
  //     stock_level, 
  //     kit_or_bundle, 
  //     vendor_email
  //   } = req.body;

  //   getVendorIDByEmail(vendor_email)
  //     .then(id => {
  //       if(!id) {
  //         res.json({
  //           msg: 'Sorry, this user does not exist'
  //         });
  //       } else {
  //         return addProduct(product_name, 
  //           upc, 
  //           ingredient, 
  //           wholesale_price, 
  //           retail_price, 
  //           height, 
  //           length, 
  //           width, 
  //           weight, 
  //           inventory_threshold, 
  //           stock_level, 
  //           kit_or_bundle,
  //           id)
  //       }
  //     })
  //     .then(newVendor => res.json(newVendor))
  //     .catch(err => res.json({
  //       error: err.message
  //     }));
  // })

  /* Edit the details of an existing Product */
  router.put('/products/:id', (req, res) => {
    const {
      product_name, 
      upc, 
      ingredient, 
      wholesale_price, 
      retail_price, 
      height, 
      length, 
      width, 
      weight, 
      inventory_threshold, 
      stock_level, 
      kit_or_bundle,
      vendor_email
    } = req.body;

    getVendorIDByEmail(vendor_email)
    .then((vendor_id) => {
      return updateProduct(
        Number(req.params.id),
        product_name, 
        upc, 
        ingredient, 
        wholesale_price, 
        retail_price, 
        height, 
        length, 
        width, 
        weight, 
        inventory_threshold, 
        stock_level, 
        kit_or_bundle,
        vendor_id
        )}
    )
      .then(setTimeout(() => {
        response.status(204).json({});
      }, 1000))
      .catch(err => res.json({
        error: err.message
      }));
  })

  /* Delete an existing product */
  router.delete('/products/:id', (req, res) => {
    const product_id = Number(req.params.id);

    deleteProduct(product_id)
    .then(setTimeout(() => {
      response.status(204).json({});
    }, 1000))
    .catch(err => res.json({
      error: err.message
    }));
  })
 return router;
}

