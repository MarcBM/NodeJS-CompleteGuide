// Global Modules
const http = require('http');
// Node-Specific Modules
const express = require('express');

// The majority of the logic used by express.js is exposed through this function, which we store in the const 'app'.
const app = express()

// Express.js works through the concept of 'Middleware'.
// When a request is sent to the server, express passes that request through a series of functions before sending a response.
// These functions are the 'Middleware'. Depending on the request, different Middleware will be executed.
// We can set up 'Middleware' using app.use(). Every request given to the server will pass through the function given to app.use().
// The function takes a request and response as normal, but also a follow-up function, which will be the next location along the chain.
app.use((req, res, next) => {
    console.log('In the middleware!');
    // Without the next() call, the request's journey would end here.
    next();
});

// We can call app.use() multiple times to define more Middleware.
// The functions get executed in order as they are given to app.
app.use((req, res, next) => {
    console.log('In another middleware!');
});

// The 'app' function is a legitimate request handler.
const server = http.createServer(app);

server.listen(3000);