// Node-Specific Modules
const express = require('express');

// The majority of the logic used by express.js is exposed through this function, which we store in the const 'app'.
const app = express()

// Express.js works through the concept of 'Middleware'.
// When a request is sent to the server, express passes that request through a series of functions before sending a response.
// These functions are the 'Middleware'. Depending on the request, different Middleware will be executed.
// We can set up 'Middleware' using app.use(). Every request given to the server will pass through the function given to app.use().
// The function takes a request and response as normal, but also a follow-up function, which will be the next location along the chain.
// app.use((req, res, next) => {
//     console.log('In the middleware!');
//     // Without the next() call, the request's journey would end here.
//     next();
// });

// app.use() can also filter urls, so that only whatever middelware we want running runs on a given response.
// For example: this middleware will run on every URL, since '/' matches every route.
app.use('/', (req, res, next) => {
    console.log('This always runs!');
    next();
});

// We can call app.use() multiple times to define more Middleware.
// The functions get executed in order as they are given to app.
// This middleware will only run on a specific set of URLs. Any URL that starts with /add-product/* will be caught.
app.use('/add-product', (req, res, next) => {
    console.log('In another middleware!');
    // Instead of next(), we can send a response back to the browser, which ends the chain of Middleware.
    // Express.js makes this more streamlined, by shortening it to a single line. It also allows for file transfer, but more on that later.
    res.send('<h1>This is the "Add Product" Page.</h1>');
});

// This will catch any URLs not caught by previous middleware, and send a generic response.
app.use('/', (req, res, next) => {
    console.log('In another middleware!');
    res.send('<h1>Welcome from Express.js!</h1>');
});

// The 'app' function is a legitimate request handler.
// const server = http.createServer(app);

// server.listen(3000);
// It also can start the server, and listen on a port, without even using the http core module directly.
app.listen(3000);