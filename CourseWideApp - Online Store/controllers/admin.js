const Product = require('../models/product');

// Get AddProduct - Used in routes/admin.js.
exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		isAuthenticated: req.session.isLoggedIn
	});
};

// Post AddProduct - Used in routes/admin.js.
exports.postAddProduct = (req, res, next) => {
	// Here we extract the product data from the form.
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const description = req.body.description;
	const price = req.body.price;
	// Using Mongoose, instead of creating a new javascript object, the constructor takes an object with the properties mapped as defined in the schema. Note that the order does not matter.
	const product = new Product({
		title: title,
		imageUrl: imageUrl,
		description: description,
		price: price,
		// Since we have full access to a mongoose object of the logged in user, we just need to pass in the id to the product constructor.
		// A cool aside: you could simply pass in the entire user to this field and mongoose would take care to extract the id from the user object for us.
		userId: req.session.user._id
	});
	// With MongoDB, we defined our own methods with which to work with our models. With Mongoose, many methods come pre-defined for us, just by using the mongoose.model() method.
	//
	product
		// The save() method will save this product to the database, and was predefined by mongoose.
		.save()
		.then(result => {
			console.log('Created Product!');
			res.redirect('/admin/products');
		})
		.catch(err => {
			console.log(err);
		});
};

// Get EditProduct - Used in routes/admin.js.
exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then(product => {
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product,
				isAuthenticated: req.session.isLoggedIn
			});
		})
		.catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;
	const updatedPrice = req.body.price;

	// Instead of creating a new object and overwriting the old product in the database, Mongoose allows us to very easily update an existing document.
	// First, we find the product in the database using its ID.
	Product.findById(prodId)
		.then(product => {
			// If we could not find the product, we redirect to the home page.
			if (!product) {
				return res.redirect('/');
			}
			// Otherwise, we simply access each data field we would like to change, update the values, and call save(). Mongoose's save() method will take care to update the existing document with any new values that are provided.
			product.title = updatedTitle;
			product.imageUrl = updatedImageUrl;
			product.description = updatedDescription;
			product.price = updatedPrice;
			return product.save();
		})
		.then(result => {
			console.log('Updated Product!');
			// The page redirection is placed inside the then() block to make sure the page renders with the new values. This does mean that we are not doing any redirection if an error occurs, but we will look at that in a future module of the course.
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
	Product.find()
		// The select method allows us to choose which fields to retrieve from the results of the find query. A '-' in front of a field excludes that field explicitly, which is the only way not to retrieve the id.
		// .select('title price -_id')
		// The populate method allows us to exploit mongoose's understanding of the relationship between models. By choosing which field to populate, mongoose will attempt to retrieve any data associated with that field. This example shows that by populating the userId associated with a product, we can populate the entire user data within the product.
		// The second argument is simply a select method for the populating data.
		// .populate('userId', 'name')
		.then(products => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
				isAuthenticated: req.session.isLoggedIn
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	// Mongoose also provides a method to delete a specific document from the database.
	Product.findByIdAndRemove(prodId)
		.then(() => {
			console.log('Deleted Product!');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));
};
