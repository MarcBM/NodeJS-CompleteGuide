// Core Node Modules
const path = require('path');
// Node-Specific Modules
const express = require('express');
const bodyParser = require('body-parser');
// Custom Routes Modules
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// Custom Controller Modules
const errorController = require('./controllers/error');
// Custom Database Module
const db = require('./util/database');

const app = express();

app.set('view engine', 'ejs')

app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

db.execute('SELECT * FROM products')
    .then(result => {
        console.log(result[0], "\n", result[1]);
    })
    .catch(err => {
        console.log(err);
    });

app.use(errorController.get404);

app.listen(3000);