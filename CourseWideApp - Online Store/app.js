// Core Node Modules
const path = require('path');
// Node-Specific Modules
const express = require('express');
const bodyParser = require('body-parser');
// Custom Routes Modules
const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
// Custom Controller Modules
const errorController = require('./controllers/error');
// Custom Database Module
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// We are registering another middleware function that will allow us to access our user at any point in the app.
app.use((req, res, next) => {
    // // We can find the user here since we know that there will always be a user once a request comes into the server.
    // User.findByPk(1)
    //     .then(user => {
    //         // By adding the user to the request object, we can access the user at any point in the app. We are able to do this since 'user' is not a pre-defined field of the request object.
    //         req.user = user;
    //         // Don't forget to call the next middleware function!
    //         next();
    //     })
    //     .catch(err => console.log(err));
    next();
});

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

// Since we are migrating over to MongoDB, all old DB code is getting deleted.
mongoConnect(() => {
    app.listen(3000);
});