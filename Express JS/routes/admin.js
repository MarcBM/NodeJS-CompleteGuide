const express = require('express');

// This router is a subset of 'app'. It handles routing only, and so we can re-assign much of the work we've already done to routers like this.
const router = express.Router();

// The router functions work identically to the old app.use etc.
// We can call app.use() multiple times to define more Middleware.
// The functions get executed in order as they are given to app.
// This middleware will only run on a specific set of URLs. Any URL that starts with /add-product/* will be caught.
router.get('/add-product', (req, res, next) => {
    // Instead of next(), we can send a response back to the browser, which ends the chain of Middleware.
    // Express.js makes this more streamlined, by shortening it to a single line. It also allows for file transfer, but more on that later.
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

// This middleware could be above /add-product, as they have no relation to on another in the path field.
// It must be above '/' though, as we want this to run on '/product', not the catch-all.
// We also only want this middleware to execute on POST requests, not any sort of requests.
// We do this by changing the app function we use to register the middleware. app.post only accepts POST requests.
// The non-use functions require exact path matching, not just the start of the path match.
router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;