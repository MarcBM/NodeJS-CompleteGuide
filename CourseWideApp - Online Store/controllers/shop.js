// Here in the 'shop' controller, we are going to place all of the logic that deals with the shop. All this logic already existed inside the routes files, but to avoid bloating them too much, we can place the logic here instead.

const Product = require('../models/product');
const Order = require('../models/order');

// Get Products data - Used in routes/shop.js.
exports.getProducts = (req, res, next) => {
	// Mongoose doesn't provide us with a fetchAll method, but it does expose the find method we are already familiar with. Instead of returning a cursor, it instead returns the entire array. If the data set is too large for this, you can use the .cursor() method to go back to getting the cursor.
	Product.find()
		.then(products => {
			// console.log(products);
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products'
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	// The findById method is provided by Mongoose, and even better, we don't need to mess about with the gross MongoDB Object ID object conversions. Therefore, our code should work as expected with no changes!
	Product.findById(prodId)
		.then(product => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products'
			});
		})
		.catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/'
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getCart = (req, res, next) => {
	req.user
		// You can also populate a path from the current object.
		.populate('cart.items.productId')
		.then(user => {
			const products = user.cart.items;
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: products
			});
		})
		.catch(err => console.log(err));
};

// This method is used to add products to the cart, and must be rewritten to use the new mongoDB user model.
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	// First we can find the product in the database by its ID.
	Product.findById(prodId)
		// Then we can call the User.AddToCart method to add the product to the user's cart.
		.then(product => {
			return req.user.addToCart(product);
		})
		.then(result => {
			res.redirect('/cart');
		})
		.catch(err => console.log(err));
};

// This method is used to remove products from the cart, and must be rewritten to use the new sequelize cart model.
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.removeFromCart(prodId)
		.then(result => {
			res.redirect('/cart');
		})
		.catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.then(user => {
			const products = user.cart.items.map(i => {
				// This slightly arcane way to extract the product data is to let us take exactly all the document data and put it into a new object so we ensure mongoDB snapshots it. Otherwise, mongoose is attempting to streamline the data by just storing a reference.
				return { quantity: i.quantity, product: { ...i.productId._doc } };
			});
			const order = new Order({
				user: {
					name: req.user.name,
					userId: req.user._id
				},
				products: products
			});
			return order.save();
		})
		.then(result => {
			return req.user.clearCart();
		})
		.then(result => {
			res.redirect('/orders');
		})
		.catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
	Order.find({ 'user.userId': req.user._id })
		.then(orders => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders
			});
		})
		.catch(err => console.log(err));
};
