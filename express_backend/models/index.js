module.exports = db => {

  const getUsers = () => {

    const query = {
      text: `SELECT * FROM vendors`
    }

    return db.query(query)
      .then(result => result.rows)
      .catch(err => err)
  }

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

  return {
    getUsers,
    getProducts,
    getVendorByEmail,
    addVendor
  }

}