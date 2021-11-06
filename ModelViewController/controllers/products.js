// Here in the 'products' controller, we are going to place all of the logic that deals with products.
// All this logic already existed inside the routes files, but to avoid bloating them too much,
// we can place the logic here instead.

const Product = require('../models/product');

// Get AddProduct - Used in admin.js.
exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        docTitle: "Add Product",
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

// Post AddProduct - Used in admin.js.
exports.postAddProduct = (req, res, next) => {
    // Here we save the product to our array.
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

// Get Products data - Used in shop.js.
exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll();
    res.render('shop', {
        prods: products,
        docTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
};