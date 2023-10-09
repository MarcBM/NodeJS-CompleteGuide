const User = require('../models/user');

// A simple function to render the login page.
exports.getLogin = (req, res, next) => {
	// Here is an example of how we could access the isLoggedIn Cookie value.
	// Obviously you would want to be more robust about this, since we have hard-coded which array indexes we expect the cookie to lie in.
	// const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1] === 'true';
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: req.session.isLoggedIn
	});
};

// We are implementing a proper authentication flow in a later module.
exports.postLogin = (req, res, next) => {
	// Adding this field to the request here is completely useless, because as soon as we send a response to redirect the user, the request dies, and a new one is used for that redirection.
	// req.isLoggedIn = true;

	// Instead of adding to the dying request, using cookies solves this problem for us. A cookie is added to the response object as a header, and is then stored by the browser for long term use.
	// By default, cookies are set to be 'session-only', which means that once you close the browser, the cookie is deleted.
	// By default, cookies are sent with every request to the server, so in any request handling, you can access such cookies.
	// While cookies are useful for tracking various pieces of data, using them for sensitive purposes is not a good idea as they can easily be manipulated by the browser without our knowledge.
	// Creating a new cookie is fairly straightforward, all you have to do is add a header to the response, using the 'Set-Cookie' header field. In its simplest form, a cookie is simply a key-value pair.
	// res.setHeader('Set-Cookie', 'loggedIn=true');

	// Instead of having the user be found in every single request, we are going to only access user data on login.
	User.findById('651e8341a9a7b8901aed0451')
		.then(user => {
			// Instead of using a cookie, we are going to use sessions for authentication.
			req.session.isLoggedIn = true;
			// We can store the user directly onto the session object, since that will be unique to the browser instance.
			req.session.user = user;
			// In situations where we want to be certain that our session has finished creating/updating before exectuing following code, we can use the session.save() method. This takes a function that will execute once the session has been saved.
			// In our case here, we need to wait for the session to be saved before we redirect, so that the redirected page accurately reflects the login state.
			req.session.save(err => {
				if (err) console.log(err);
				res.redirect('/');
			});
		})
		.catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
	// When logging out, we don't want to just delete the cookie from the browser, we would also like to delete the session from the database.
	req.session.destroy(err => {
		if (err) console.log(err);
		res.redirect('/');
	});
};
