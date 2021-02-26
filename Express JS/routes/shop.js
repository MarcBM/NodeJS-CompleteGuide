const express = require('express');

const router = express.Router();

// This will catch any URLs not caught by previous middleware, and send a generic response.
router.get('/', (req, res, next) => {
    res.send('<h1>Welcome from Express.js!</h1>');
});

module.exports = router;