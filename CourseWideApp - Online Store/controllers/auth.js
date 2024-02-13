const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: false
	});
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		isAuthenticated: false
	});
};

exports.postLogin = (req, res, next) => {
	User.findById('5bab316ce0a7c75f783cb8a8')
		.then(user => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save(err => {
				console.log(err);
				res.redirect('/');
			});
		})
		.catch(err => console.log(err));
};

// Here we are collecting the information from the form and creating a new user. We are then redirecting to the login page.
exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	// Normally we would validate data here, but we are skipping that for now. There will be a whole module on this later.

	// If a user with this email already exists, we don't want to make a new user.
	User.findOne({ email: email })
		.then(userDoc => {
			if (userDoc) {
				// If the user exists, we are redirecting back to the sign-up page.
				return res.redirect('/signup');
			}
			return bcrypt.hash(password, 12);
		})
		.then(hashedPassword => {
			const user = new User({
				email: email,
				password: hashedPassword,
				cart: { items: [] }
			});
			return user.save();
		})
		.then(result => {
			res.redirect('/login');
		})
		.catch(err => {
			console.log('User Sign-Up Error: ' + err);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});
};
