module.exports = db => {

  /* Gets the list of all vendors from database*/
  const getUsers = () => {

    const query = {
      text: `SELECT * FROM vendors`
    }

    return db.query(query)
      .then(result => result.rows)
      .catch(err => err)
  }

  /* Gets the list of all products from database*/
  const getProducts = () => {

    const query = {
      text: `SELECT vendors.id as vendor_id, 
      first_name, 
      email, 
      products.id as product_id,
      product_name
      FROM vendors
      INNER JOIN products 
      ON vendors.id = products.vendor_id`
    }

    return db.query(query)
      .then(result => result.rows)
      .catch(err => err)
  }

  /* Gets the specific vendor from database that matches the given email */
  const getVendorByEmail = email => {

    const query = {
      text: `SELECT * FROM vendors WHERE email = $1`,
      values: [email]
    }

    return db
      .query(query)
      .then(result => result.rows[0])
      .catch((err) => err);
  }

  /* Inserts a new vendor into the database */
  const addVendor = (firstName, lastName, company, title, email, phone, companyUrl, contactMethod, handle, description, comments, stageId, reviewerId) => {
    
    const query = {
      text: `INSERT INTO vendors (
      first_name,
      last_name,
      company,
      title,
      email,
      phone,
      company_url,
      contact_method,
      handle,
      description,
      comments,
      stage_id,
      reviewer_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      values: [
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
      ]
    }

    return db.query(query)
      .then(result => result.rows[0])
      .catch(err => err);
  }

  /* Inserts a new product into the database */
  // const addProduct = (product_name, upc, ingredient, wholesale_price, retail_price, height, length, width, weight, inventory_threshold, stock_level, kit_or_bundle, vendor_id) => {
    
  //   const query = {
  //     text: `INSERT INTO products (
  //       product_name, 
  //       upc, 
  //       ingredient, 
  //       wholesale_price, 
  //       retail_price, 
  //       height, 
  //       length, 
  //       width, 
  //       weight, 
  //       inventory_threshold, 
  //       stock_level, 
  //       kit_or_bundle, 
  //       vendor_id
  //     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
  //     values: [
  //       product_name, 
  //       upc, 
  //       ingredient, 
  //       wholesale_price, 
  //       retail_price, 
  //       height, 
  //       length, 
  //       width, 
  //       weight, 
  //       inventory_threshold, 
  //       stock_level, 
  //       kit_or_bundle, 
  //       vendor_id
  //     ]
  //   }

  //   return db.query(query)
  //     .then(result => result.rows[0])
  //     .catch(err => err);
  // }

  /* Gets the specific vendor ID from database that matches the given email */
  const getVendorIDByEmail = email => {

    const query = {
      text: `SELECT id FROM vendors WHERE email = $1`,
      values: [email]
    }

    return db
      .query(query)
      .then(result => result.rows[0])
      .catch((err) => err);
  }

  /* Updates an existing product in the database */
  const updateProduct = (id, product_name, upc, ingredient, wholesale_price, retail_price, height, length, width, weight, inventory_threshold, stock_level, kit_or_bundle, vendor_id) => {
    
    const query = {
      text: `
      INSERT INTO products (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      )
      ON CONFLICT (id) DO
      UPDATE SET
        product_name = $1, 
        upc = $2, 
        ingredient = $3, 
        wholesale_price = $4, 
        retail_price = $5, 
        height = $6, 
        length = $7, 
        width = $8, 
        weight = $9, 
        inventory_threshold = $10, 
        stock_level = $11, 
        kit_or_bundle = $12, 
        vendor_id = $13
      WHERE id = $14
      RETURNING *`,
      values: [
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
        vendor_id,
        id
      ]
    }

    return db.query(query)
      .then(result => result.rows[0])
      .catch(err => err);
  }

   /* Deletes the product row from the database */
   const deleteProduct = id => {

    const query = {
      text: `DELETE FROM products WHERE id = $1`,
      values: [id]
    }

    return db
      .query(query)
      .then(result => result.rows[0])
      .catch((err) => err);
  }

  return {
    getUsers,
    getProducts,
    getVendorByEmail,
    addVendor,
    getVendorIDByEmail,
    updateProduct,
    deleteProduct
  }

}