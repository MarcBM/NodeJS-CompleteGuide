// Node Core Modules
const path = require('path');
// Node-Specific Modules
const express = require('express');
// Custom Controller Modules
const adminController = require('../controllers/admin')

const router = express.Router();

// When retrieving a function from a controller, we are just storing a reference, not a call.
router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;