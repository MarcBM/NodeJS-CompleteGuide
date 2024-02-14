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
// Custom Security Modules
const csrf = require('csurf');
// Custom Error Handling Modules
const flash = require('connect-flash');
// Custom Data Models
const User = require('./models/user');

// We need to pass the url of the database in here. For more security, this is stored in a txt file stored only locally. To migrate this project properly, make sure this txt file exists in the same folder as app.js.
const dbURI = fs.readFileSync('dbURI.txt', 'utf8').toString();

const app = express();
const store = new MongoDBStore({
	uri: dbURI,
	collection: 'sessions'
});
// Here we are initialising our CSRF protection. A CSRF attack is when a user is tricked into performing an action they did not intend to do. This is done by sending a request to the server from a different website. Any time we are dealing with sensitive or consequential actions, we should protect against a potential CSRF attack.
const csrfProtection = csrf();

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
// After we initialise the session, we can add the CSRF protection to the middleware stack. This will add a token to every request that is sent to the server. This token is then checked against the token stored in the session. If the tokens do not match, the request is rejected.
app.use(csrfProtection);

// Here we are initialising our flash middleware. This will allow us to add messages to the session that will be displayed to the user. This is useful for adding error messages to the user. This must be initialised after the session middleware.
app.use(flash());

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

// IMPORTANT - CSURF is a deprecated package, and real world usages should be replaced with a new package.
// Here we are adding a new middleware that will tell ejs that there is some data we wish to add to every single view. This is the CSRF token. We are also adding a boolean value to the view that will tell us if the user is authenticated or not.
app.use((req, res, next) => {
	// The locals field allows us to add local variables that will be passed to every view. This is useful for adding data that is used in every view.
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
	.connect(dbURI)
	.then(result => {
		console.log('Connected to MongoDB, courtesy of Mongoose!');
		app.listen(3000);
	})
	.catch(err => console.log(err));
