// Node Core Modules
const path = require('path');
// Node-Specific Modules
const express = require('express');
// Custom Controller Modules
const productsController = require('../controllers/products')

const router = express.Router();

router.get('/', productsController.getProducts);

module.exports = router;