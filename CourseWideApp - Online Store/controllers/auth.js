const User = require('../models/user');

// A simple function to render the login page.
exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: req.session.isLoggedIn
	});
};

exports.postLogin = (req, res, next) => {
	User.findById('651e8341a9a7b8901aed0451')
		.then(user => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save(err => {
				if (err) console.log(err);
				res.redirect('/');
			});
		})
		.catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		if (err) console.log(err);
		res.redirect('/');
	});
};
