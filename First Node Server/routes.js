const fs = require('fs');

// Note below the nested callbacks of the below code segment. The architecture of Node.js is built on this idea.
// The use of callbacks as often as possible gives the server as much time as possible to be ready to recieve more requests.
// The callbacks are offloaded to the OS, which runs these tiny operations on multiple threads.

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    // *JS* '===' matches both type and contents. Since JS is soft-typed.
    if (url === '/') {
        // This is a simple form that asks for a message from the user, and then submits the response to the url /message.
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write(
            '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
        );
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
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            // This splits the message into its key and value, and then takes just the value.
            const message = parsedBody.split('=')[1];
            // This will be the response in the case someone has submitted a message.
            fs.writeFile('messages.txt', message, (err) => {
                // Status Code 302 stands for redirection.
                res.statusCode = 302;
                // This is the url of the redirection.
                res.setHeader('Location', '/');
                return res.end();
            });
        })
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
};

// To expose contents of one file to another, we cannot simply include the file and use access modifiers.
// As far as I know, access modifiers don't exist in JS.
// Therefore, we specifically expose (or, 'export') certain aspects of the file to be seen when imported.
// This makes the file act as an object, which has methods and fields.

// There are many syntaxes to be used to achieve this effect, though it's best not to mix them.

// This exposes specifically one aspect of the file, and is accessed by simply referring to the entire object that is imported.
// module.exports = requestHandler;

// This exposes multiple aspects, and is accessed by referring to them specifically. eg: routes.requestHandler
// module.exports = {
//     handler: requestHandler;
//     someText: 'Some hard coded text.'
// }

// This is the same as above, but in a different format.
// module.exports.handler = requestHandler;
// module.exports.someText = 'Some hard coded text.';

// This is simply a short-cut for the above syntax.
exports.handler = requestHandler;