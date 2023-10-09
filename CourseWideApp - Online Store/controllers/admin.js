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
	const product = new Product({
		title: title,
		imageUrl: imageUrl,
		description: description,
		price: price,
		userId: req.session.user._id
	});
	product
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

	Product.findById(prodId)
		.then(product => {
			if (!product) {
				return res.redirect('/');
			}
			product.title = updatedTitle;
			product.imageUrl = updatedImageUrl;
			product.description = updatedDescription;
			product.price = updatedPrice;
			return product.save();
		})
		.then(result => {
			console.log('Updated Product!');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
	Product.find()
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
	Product.findByIdAndRemove(prodId)
		.then(() => {
			console.log('Deleted Product!');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));
};
