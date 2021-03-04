const path = require('path');

const express = require('express');

const router = express.Router();

const rootDir = require('../util/path');

// This will catch any URLs not caught by previous middleware, and send a generic response.
router.get('/', (req, res, next) => {
    // res.send('<h1>Welcome from Express.js!</h1>');
    // Instead of sending dummy html, we can send an html file to the user.
    // This path must be absolute, so we must make use of the path core module from Node.js.
    // path.join() returns a path that is a combination of paths. We can use the Node global variable __dirname to access the root of our folder.
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;