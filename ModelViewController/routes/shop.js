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