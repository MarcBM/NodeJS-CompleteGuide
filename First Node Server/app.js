// This is the syntax for importing a namespace into our code.
// Can take filepaths (relative ./ or absolute /), as well a recognised name.
const http = require('http');
const fs = require('fs');
const { parse } = require('path');

// http.createServer() requires a 'Request Listener'. This function will be called upon every recieved request.
// Note that the function is itself embedded in the create server call. This is standard practice.
// The createServer() function returns a server object, which we store.
const server = http.createServer((req, res) => {
    // console.log(req);
    // We can store data from the request and act accordingly.
    // The url contains any information after the domain. The root is just '/'.
    const url = req.url;
    // The method contains the html method used to access this url. EG GET, POST...
    const method = req.method;

    // *JS* '===' matches both type and contents. Since JS is soft-typed.
    if (url === '/') {
        // This is a simple form that asks for a message from the user, and then submits the response to the url /message.
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>')
        res.write('</html>');
        // We return res.end() here so that we don't continue execution of the Request Listener after the execution of res.end().
        // In this case, we do nothing with the returned value.
        return res.end();
    }

    if (url === '/message' && method === 'POST') {
        const body = [];
        // To recieve request data, we need to register an event listener.
        // req.on() listens for a particular event from the request. It will fire a function when that particular event is found.
        req.on('data', (chunk) => {
            console.log(chunk)
            body.push(chunk);
        });
        // Once we have our data, we need to convert it to a readable type.
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            // This will be the response in the case someone has submitted a message.
            fs.writeFileSync('messages.txt', message);
        })
        // Status Code 302 stands for redirection.
        res.statusCode = 302;
        // This is the url of the redirection.
        res.setHeader('Location', '/');
        return res.end();
    }

    // The response (res) object is an object we can fill with data to pass back to the browser.
    res.setHeader('Content-Type', 'text/html');
    // res.write() can contain chunks of code to send to the browser, of the type specified in the header above.
    // This is extraordinary jank, and there will be better ways to do it.
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>')
    res.write('</html>');
    // Once we are finished writing, we can call res.end(), and once we've done that, we cannot write anymore.
    res.end()
});

// Asking the server to listen will keep the server open on a certain port.
server.listen(3000);