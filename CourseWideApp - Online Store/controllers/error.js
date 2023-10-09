// This is a controller that will handle errors.

// Get 404 - Used in app.js
exports.get404 = (req, res, next) => {
	res.status(404).render('404', {
		pageTitle: 'Page not Found',
		path: '/404',
		isAuthenticated: req.session.isLoggedIn
	});
};
