const { runInNewContext } = require("vm");

// Main Server Request Handler
const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');

        res.write('<html>');
        res.write('<head><title>What is your Name?</title></head>');
        res.write('<body>');
        res.write('<h1>Hi! What is your Name?</h1>');
        res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Submit</button></form>');
        res.write('</body>');
        res.write('</html>');

        return res.end();
    }

    if (url === '/users') {
        res.setHeader('Content-Type', 'text/html');

        res.write('<html>');
        res.write('<head><title>User List (NOT REAL)</title></head>');
        res.write('<body>');
        res.write('<h1>Users:</h1>');
        res.write('<ul><li>Fred Macintosh</li><li>Georg Applebaum</li><li>Ashton McSilk</li><li>Oram Lion-Heart</li></ul>');
        res.write('</body>');
        res.write('</html>');

        return res.end();
    }

    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split('=')[1];
            console.log(username);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
        })
    }
};

exports.handler = requestHandler;