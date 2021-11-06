// Node Core Modules
const path = require('path');
// Node-Specific Modules
const express = require('express');
// Custom Controller Modules
const productsController = require('../controllers/products')

const router = express.Router();

// When retrieving a function from a controller, we are just storing a reference, not a call.
router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProduct);

module.exports = router;