const express = require('express');
const router = express.Router();
const mailgun = require("mailgun-js");
require('dotenv').config();

const { getProductByVendor, getVendorList } = require('../helpers/dataHelpers');
const {vendor_welcome} = require('../util/email/vendor_welcome');
const {product_reject} = require('../util/email/product_reject');
const {vendor_reject} = require('../util/email/vendor_reject');
const {vendor_approve} = require('../util/email/vendor_approve');


const DOMAIN = `${process.env.DOMAIN}`;
const api_key = `${process.env.API_KEY}`;
const mg = mailgun({
  apiKey: api_key, 
  domain: DOMAIN
});

module.exports = ({ getUsers, getReviewers, getProducts, getVendorByEmail, addProduct,addVendor, getVendorIDByEmail, updateProduct, deleteProduct, updateStage }) => {

  /* GET vendor listing. */
  router.get('/', function(req, res) {
    getUsers()
      .then(users => res.json(users))
      .catch(err => res.json({ msg: err.message }))
  });
  
   /* GET reviewer listing. */
   router.get('/reviewers', function(req, res) {
    getReviewers()
      .then(reviewers => {
        const formattedReviewers = getVendorList(reviewers);
        res.json(formattedReviewers);
      })
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
          vendor_welcome(mg, firstName, email);
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

  /* Send e-mail to vendor with attachments, and link to upload signed attachments post approval of vendor application */
  router.put('/:id', (req, res) => {
    const {
      vendor_email,
      url,
      feedback,
      vendor_stage
    } = req.body.approved ? req.body.approved : req.body.declined;

    getVendorByEmail(vendor_email)
      .then(vendor => {
        if(!vendor) {
          res.json({
            msg: 'Sorry, this user does not exist'
          });
        } else {
          if (feedback) {
            product_reject(mg, vendor_email, url, feedback);
          } else {
            if (vendor_stage === 2) {
              vendor_approve(mg, vendor_email, url);
              updateStage(vendor.id, vendor_stage);
            } else {
              vendor_reject(mg, vendor_email);
            }
          }
        }
      })
      .then(() => {
        setTimeout(() => {
          res.status(200).send('Message sent to vendor.');
        }, 1000);
      })
      .catch(
        err => res.json({error: err.message})
      )
  })


  /* Reviewer to be notified when attachments are uploaded*/

  /* Send e-mail to vendor with product form link */

  /* Reviewer to be notified when product details are submitted*/

  /* Send e-mail to vendor requesting shipment of products post approval of vendor product details */

  /* Send e-mail to vendor post rejection of vendor product details, with link to edit product details */

  /* Send e-mail to vendor once shipment has been recieved by AllGood*/

  /* INSERT new products*/
  router.post('/products', (req, res) => {
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
      .then(id => {
        if(!id) {
          res.json({
            msg: 'Sorry, this user does not exist'
          });
        } else {
          return addProduct(product_name, 
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
            id)
        }
      })
      .then(newVendor => res.json(newVendor))
      .catch(err => res.json({
        error: err.message
      }));
  })

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
        res.status(204).json({});
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
      res.status(204).json({});
    }, 1000))
    .catch(err => res.json({
      error: err.message
    }));
  })
 return router;
}

