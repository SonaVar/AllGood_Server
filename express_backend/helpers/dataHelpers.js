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
      product_id: product.product_id,
      product_name: product.product_name
    });

  }

  return Object.values(productOfVendor);
};

module.exports = {
  getProductByVendor,
};