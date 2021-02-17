// Core Modules
const http = require('http');
// Custom Modules
const routes = require('./routes');

// Server Spin-Up & Event Listener Registration
const server = http.createServer(routes.handler);

// Server Listen Command
server.listen(3000);