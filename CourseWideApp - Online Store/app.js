// Core Node Modules
const path = require('path');
const fs = require('fs');
// Node-Specific Modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
// Custom Routes Modules
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
// Custom Controller Modules
const errorController = require('./controllers/error');
// Custom Database Module
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
// Custom Data Models
const User = require('./models/user');

// We need to pass the url of the database in here. For more security, this is stored in a txt file stored only locally. To migrate this project properly, make sure this txt file exists in the same folder as app.js.
const dbURI = fs.readFileSync('dbURI.txt', 'utf8').toString();

const app = express();
// Here we are configuring our session storage system. We are linking the session package to our MongoDB database, and defining the sessions collection.
const store = new MongoDBStore({
	uri: dbURI,
	collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// We are registering middleware here to be able to manage 'sessions'.
// Sessions are stored on the server side, and can be used to keep track of particular information across requests, such as authentication. They are much more secure than cookies, because they are stored on the server side, only accessed through a hashed id on a cookie from the client.
// All the basic options are included here, and should be used every time. You can also configure options about the session cookie, such as the expiration time, etc.
app.use(
	session({
		// This option is used to set up the hashing. It should ideally be a long string.
		secret: 'this is a long string',
		// This stops the session from being saved every single request.
		resave: false,
		// This stops the session from being saved when the user refreshes the page.
		saveUninitialized: false,
		// This tells the middleware how to store the sessions in the database, as opposed to in memory.
		store: store
	})
);

// Since we have now stored the user in the session object, we aren't getting anything more than data back from our calls. To fix this, we need to reassign the req.user field, by using the data found in the session object.
app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// Using Mongoose, we don't need to worry about all the connection logic, it is handled for us.
mongoose
	.connect(dbURI)
	.then(result => {
		// Here we are creating a new user if there is no user in the system yet. FindOne() will return the first document that matches the query, and if there is no query, it will just return the first document in the database.
		User.findOne().then(user => {
			if (!user) {
				const user = new User({
					name: 'Marc',
					email: 'marc.betbeder@hotmail.com',
					cart: { items: [] }
				});
				user.save();
			}
		});
		console.log('Connected to MongoDB, courtesy of Mongoose!');
		app.listen(3000);
	})
	.catch(err => console.log(err));
