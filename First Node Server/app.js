// This is the syntax for importing a namespace into our code.
// Can take filepaths (relative ./ or absolute /), as well a recognised name.
const http = require('http');

// http.createServer() requires a 'Request Listener'. This function will be called upon every recieved request.
// Note that the function is itself embedded in the create server call. This is standard practice.
// The createServer() function returns a server object, which we store.
const server = http.createServer((req, res) => {
    console.log(req);
});

// Asking the server to listen will keep the server open on a certain port.
server.listen(3000);