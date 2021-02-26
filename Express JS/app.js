// Node-Specific Modules
const express = require('express');
const bodyParser = require('body-parser');
// Custom Modules
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

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
// app.use('/', (req, res, next) => {
//     next();
// });

// To parse content, we need to register a parser with app.use.
// Usually, we place this above all of our routing middleware.
// The bodyParser.urlencoded function registers middleware that parses the body of the request for us.
// It will also call 'next()' at the end, so that the request reaches our middleware as well.
app.use(bodyParser.urlencoded({ extended: false }));

// The router object we have imported works as a valid middleware function.
// The order of these middleware functions still matters.
app.use(adminRoutes);
app.use(shopRoutes);

// If none of our routes resolve the request, the we end up here at the bottom of our middleware chain.
app.use((req, res, next) => {
    // Note here we can chain our functions together. The only requirement is that send() is last in the chain.
    res.status(404).send('<h1>Page not found.</h1>');
});

// The 'app' function is a legitimate request handler.
// const server = http.createServer(app);

// server.listen(3000);
// It also can start the server, and listen on a port, without even using the http core module directly.
app.listen(3000);