const getVendorList = (reviewers) => {
  const vendorList = {};

  for (let item of reviewers) {
    if(!vendorList[item.reviewer_id]) {
      vendorList[item.reviewer_id] = {
        id : item.reviewer_id,
        email : item.reviewer_email,
        username : item.username,
        password : item.password,
        vendors : []
      };
      
    }
    
    vendorList[item.reviewer_id].vendors.push(item.vendor_id);
  }

  return Object.values(vendorList);
}


const getProductByVendor = (vendorProducts) => {
  const productOfVendor = {};

  for (let product of vendorProducts) {
    if (!productOfVendor[product.vendor_id]) {
      productOfVendor[product.vendor_id] = {
        vendor_id: product.vendor_id,
        first_name: product.first_name,
        email: product.email,
        products: []
      };
    }

    productOfVendor[product.vendor_id].products.push({
      product_id : product.product_id,
      product_name : product.product_name,
      upc : product.upc,
      ingredient : product.ingredient,
      wholesale_price : product.wholesale_price,
      retail_price : product.retail_price,
      height : product.height,
      length : product.length,
      width : product.width,
      weight : product.weight,
      inventory_threshold : product.inventory_threshold,
      stock_level : product.stock_level,
      kit_or_bundle : product.kit_or_bundle
    });

  }

  return Object.values(productOfVendor);
};

module.exports = {
  getProductByVendor,
  getVendorList
};