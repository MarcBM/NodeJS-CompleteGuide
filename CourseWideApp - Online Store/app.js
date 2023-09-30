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
const sequelize = require('./util/database');
// To add model relationships we need to import the models here so that we can define the relationships at startup time.
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// We are registering another middleware function that will allow us to access our user at any point in the app.
app.use((req, res, next) => {
    // We can find the user here since we know that there will always be a user once a request comes into the server.
    User.findByPk(1)
        .then(user => {
            // By adding the user to the request object, we can access the user at any point in the app. We are able to do this since 'user' is not a pre-defined field of the request object.
            req.user = user;
            // Don't forget to call the next middleware function!
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Before we sync our database and start the server, we are going to setup our relationships.
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

// Command to sync all defined models in the app with the MySQL database.
// Sequelize creates/updates any new/changed definitions into tables.
sequelize
    // This force: true option will force the database to recreate any defined tables, allowing us to update the relationships. This will delete the existing tables, so we don't want to do this at production time.
    // .sync({force: true})
    .sync()
    .then(result => {
        // Here we are creating a dummy user so that we can test with it until we actually implement authentication.
        // By finding the user with ID 1, we are checking if the user already exists.
        return User.findByPk(1);
        // console.log(result)
    })
    .then(user => {
        if (!user) {
            // Again we don't want to nest promises, but in case the user already exists, we have two return statements. This one is standard, returning a promise that creates a new user.
            return User.create({
                name: 'Marc',
                email: 'marc@betbeder.com'
            });
        }
        // If the user already exists, we return a promise that resolves to the user. Theoretically, since we are returning a non-promise object from within a then() block, we could just return the user object directly, as any non-promise object is automatically wrapped in this Promise.resolve() call.
        return Promise.resolve(user);
    })
    .then(user => {
        // console.log(user);
        // We only want to start the server if the database syncs successfully.
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });