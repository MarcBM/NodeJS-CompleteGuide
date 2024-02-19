const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../models/user');

// A transporter is an object that will define the connection to the mail server.
// These options are from the mailtrap email testing service. https://mailtrap.io
const transporter = nodemailer.createTransport({
	host: 'sandbox.smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: '5abf07a40be149',
		pass: '969ea048dca215'
	}
});

exports.getLogin = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: message
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		errorMessage: message
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				req.flash('error', 'Invalid email or password.');
				return res.redirect('/login');
			}
			bcrypt
				.compare(password, user.password)
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
					req.flash('error', 'Invalid email or password.');
					res.redirect('/login');
				})
				.catch(err => {
					console.log(err);
					res.redirect('/login');
				});
		})
		.catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	User.findOne({ email: email })
		.then(userDoc => {
			if (userDoc) {
				req.flash(
					'error',
					'E-Mail exists already, please pick a different one.'
				);
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
					// Here we don't need to wait for the email to be sent before we redirect the user, so we do that immediately, even though the email sending process is still running in the background.
					res.redirect('/login');
					return transporter.sendMail({
						to: email,
						from: 'vuldyn@lotroforge.com',
						subject: 'Signup Succeeded!',
						html: '<h1>You successfully signed up!</h1>'
					});
				})
				.catch(err => {
					console.log(err);
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
