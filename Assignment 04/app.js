const express = require('express');
const bodyParser = requrie('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended = false }));

app.use('/users', (req, res, next) => {

});

app.get('/', (req, res, next) => {

});

app.post('/', (req, res, next) => {

});

app.listen(3000);