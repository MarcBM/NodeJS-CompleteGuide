// Core Node Modules
const path = require('path');
const fs = require('fs');
// Node-Specific Modules
const express = require('express');
const bodyParser = require('body-parser');
// Custom Routes Modules
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// Custom Controller Modules
const errorController = require('./controllers/error');
// Custom Database Module
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// We are registering another middleware function that will allow us to access our user at any point in the app.
app.use((req, res, next) => {
	// We can find the user here since we know that there will always be a user once a request comes into the server.
	User.findById('651cc80d4db4fd9cc16c07fe')
		.then((user) => {
			// By adding the user to the request object, we can access the user at any point in the app. We are able to do this since 'user' is not a pre-defined field of the request object.
			// Instead of just adding what the db gives us, we can create a new user object from this data so we can make use of any methods included in the User Class.
			req.user = new User(user.name, user.email, user.cart, user._id);
			// Don't forget to call the next middleware function!
			next();
		})
		.catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// We need to pass the url of the database in here. For more security, this is stored in a txt file stored only locally. To migrate this project properly, make sure this txt file exists in the same folder as app.js.
const dbURL = fs.readFileSync('dbURL.txt', 'utf8').toString();
// Using Mongoose, we don't need to worry about all the connection logic, it is handled for us.
mongoose
	.connect(dbURL)
	.then((result) => {
		console.log('Connected to MongoDB, courtesy of Mongoose!');
		app.listen(3000);
	})
	.catch((err) => console.log(err));
