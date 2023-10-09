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
const store = new MongoDBStore({
	uri: dbURI,
	collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'this is a long string',
		resave: false,
		saveUninitialized: false,
		store: store
	})
);

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

mongoose
	.connect(dbURI)
	.then(result => {
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
