const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
    console.log('This is the users url.');
    res.send('<h1>Here are the USERS!</h1>');
});

app.use('/', (req, res, next) => {
    console.log('This is the standard url.');
    res.send('<h1>You have not found the USERS!</h1>');
});

app.listen(3000);