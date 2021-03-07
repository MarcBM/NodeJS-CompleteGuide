// Node Core Modules
const path = require('path');
// Node-Specific Modules
const express = require('express');
// Custom Utility Modules
const rootDir = require('../util/path');
// Custom Data Import Modules
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    // To send the HTML template, and not the actual HTML file, we make use of the res.render method.
    // This uses our pre-defined template engine to render an HTML file from a template.
    // Since we told express where our views are, we also do not need to build a path to the template.
    // We'd also like to send our dynamic content to the template so we can take advantage of the engine.
    // We do this by defining a key-value pair in the render call.
    const products = adminData.products;
    res.render('shop', {
        prods: products,
        docTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
});

module.exports = router;