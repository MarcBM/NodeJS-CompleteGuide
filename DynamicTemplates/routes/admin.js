// Node Core Modules
const path = require('path');
// Node-Specific Modules
const express = require('express');
// Custom Utility Modules
const rootDir = require('../util/path');

const router = express.Router();

// We may want to store the data we recieve from the user. Let's do that here in an array.
// The way that we are storing this data currently is not ideal, it's actually really risky and unsafe.
// The data is mutable across all requests, including from various users at once, which is a big headache.
// This is the way we will do it for now, but is definitely not how it should be done in future.
const products = [];

router.get('/add-product', (req, res, next) => {
    res.render('add-product', {
        docTitle: "Add Product",
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    })
});

router.post('/add-product', (req, res, next) => {
    // Here we save the product to our array.
    products.push({title: req.body.title});
    res.redirect('/');
});

exports.routes = router;
exports.products = products;