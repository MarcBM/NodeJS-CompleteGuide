const Product = require('../models/product');

// Get AddProduct - Used in routes/admin.js.
exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        docTitle: "Add Product",
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

// Post AddProduct - Used in routes/admin.js.
exports.postAddProduct = (req, res, next) => {
    // Here we save the product to our array.
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            docTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
}