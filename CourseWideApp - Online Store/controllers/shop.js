// Here in the 'shop' controller, we are going to place all of the logic that deals with the shop.
// All this logic already existed inside the routes files, but to avoid bloating them too much,
// we can place the logic here instead.

const Product = require("../models/product");

// Get Products data - Used in routes/shop.js.
exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render("shop/product-list", {
				prods: products,
				pageTitle: "All Products",
				path: "/products"
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	// The findById method is defined in the product model.
	Product.findById(prodId)
		.then((product) => {
			res.render("shop/product-detail", {
				product: product,
				pageTitle: product.title,
				path: "/products"
			});
		})
		.catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render("shop/index", {
				prods: products,
				pageTitle: "Shop",
				path: "/"
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getCart = (req, res, next) => {
	req.user
		.getCart()
		.then((products) => {
			res.render("shop/cart", {
				path: "/cart",
				pageTitle: "Your Cart",
				products: products
			});
		})
		.catch((err) => console.log(err));
};

// This method is used to add products to the cart, and must be rewritten to use the new mongoDB user model.
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	// First we can find the product in the database by its ID.
	Product.findById(prodId)
		// Then we can call the User.AddToCart method to add the product to the user's cart.
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			res.redirect("/cart");
		})
		.catch((err) => console.log(err));
};

// This method is used to remove products from the cart, and must be rewritten to use the new sequelize cart model.
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.deleteItemFromCart(prodId)
		.then((result) => {
			res.redirect("/cart");
		})
		.catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
	let fetchedCart;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts();
		})
		.then((products) => {
			// console.log(products);
			return req.user
				.createOrder()
				.then((order) => {
					return order.addProducts(
						products.map((product) => {
							product.orderItem = { quantity: product.cartItem.quantity };
							return product;
						})
					);
				})
				.catch((err) => console.log(err));
		})
		.then((result) => {
			return fetchedCart.setProducts(null);
		})
		.then((result) => {
			res.redirect("/orders");
		})
		.catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
	req.user
		.getOrders({ include: ["products"] })
		.then((orders) => {
			res.render("shop/orders", {
				path: "/orders",
				pageTitle: "Your Orders",
				orders: orders
			});
		})
		.catch((err) => console.log(err));
};
