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

// Instead of just finding our dummy user and creating a session, we are going to find the user based on their provided information.
exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				// If no such user exists based on the email provided, we return to the login page. We should post an error to the user here telling them why they didn't manage to log in.
				return res.redirect('/login');
			}
			// If we made it passed here, we know the email exists, but we still need to check the password.
			// We can use bcrypt to re-hash the password and compare it to the hashed password in the database.
			bcrypt
				.compare(password, user.password)
				// bcrypt.compare will not throw an error if the passwords do not match. Instead, it will return a boolean value. We can use this to determine if the passwords match or not.
				.then(doMatch => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(err => {
							if (err) {
								console.log('Login Error: ' + err);
							}
							res.redirect('/');
						});
					}
					res.redirect('/login');
				})
				.catch(err => {
					console.log(err);
					res.redirect('/login');
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
				// If the user exists, we are redirecting back to the sign-up page. We should post an error to the user here telling them why they didn't manage to sign-up.
				return res.redirect('/signup');
			}
			return bcrypt
				.hash(password, 12)
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
				});
		})
		.catch(err => {
			console.log('User Sign-Up Error: ' + err);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		if (err) {
			console.log('Logout Error: ' + err);
		}
		res.redirect('/');
	});
};
