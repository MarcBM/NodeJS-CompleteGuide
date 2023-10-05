// NOTE: See the product model for more information on uncommented procedures here.
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	// Here we are defining a field that houses an array of embedded documents.
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true
				},
				quantity: { type: Number, required: true }
			}
		]
	}
});

// Mongoose does allow us to define our own custom methods in case we need some data logic that isn't handled natively. This is great because it is preferable to have all our data logic stored on the model itself rather than in other places throughout the application.
userSchema.methods.addToCart = function (product) {
	// As before, we can access the current product's index by looking through the current user's cart array. If it's not there, we get -1.
	const cartProductIndex = this.cart.items.findIndex((cp) => {
		// If I am not mistaken, we shouldn't need to use the toString() method, since mongoose is storing these objects better.
		return cp.productId === product._id;
	});

	let newQuantity = 1;
	const updatedCartItems = [...this.cart.items];
};

module.exports = mongoose.model('User', userSchema);

// // NOTE: See the product model for more information on uncommented methods here.

// // So that we can save our objects to the database, we need the connection to the database.
// const getDB = require('../util/database').getDB;
// const mongodb = require('mongodb');

// // Still no authentication, so we are just using a simple user model.
// class User {
// 	constructor(username, email, cart, id) {
// 		this.name = username;
// 		this.email = email;
// 		// Instead of having a whole cart model, we can instead store a cart object on the user model, which will just be an array of products, containing some or all of the product data. We can do this because we know that carts and users have a 1-to-1 relationship.
// 		this.cart = cart;
// 		this._id = id ? new mongodb.ObjectId(id) : null;
// 	}

// 	save() {
// 		const db = getDB();
// 		let dbOperation;
// 		if (this._id) {
// 			dbOperation = db
// 				.collection('users')
// 				.updateOne({ _id: this._id }, { $set: this });
// 		} else {
// 			dbOperation = db.collection('users').insertOne(this);
// 		}
// 		return dbOperation.then().catch((err) => console.log(err));
// 	}

// 	addToCart(product) {
// 		// This constant should store -1 if the product is not already in the cart, and the index of the item if it is.
// 		// =============================================================
// 		// IMPORTANT NOTE: It might be unclear why we need to use the toString() method here, but the reason why clears up some other stuff as well. When we recieve the product id, we get a string representation of a mongodb.ObjectId, but that confuses JS, so we need to explicitly convert it to a string here. This is also why we can't just plant in the product._id into the database, unless that object has been created during runtime as a proper instance of the product class.
// 		// =============================================================
// 		const cartProductIndex = this.cart.items.findIndex((cp) => {
// 			return cp.productId.toString() === product._id.toString();
// 		});

// 		let newQuantity = 1;
// 		// First we copy the array so we can edit it without affecting the original array.
// 		const updatedCartItems = [...this.cart.items];

// 		// If the product is already in the cart, we just access it in the new array, and increment the quantity by 1.
// 		if (cartProductIndex >= 0) {
// 			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
// 			updatedCartItems[cartProductIndex].quantity = newQuantity;
// 			// Otherwise, we add the relevant data to the new array as a new item.
// 		} else {
// 			// Instead of storing all the product data in the cart, we just want to store the reference to the product, as well as the quantity. This is in case the product changes while it is in someone's cart.
// 			updatedCartItems.push({
// 				productId: new mongodb.ObjectId(product._id),
// 				quantity: newQuantity
// 			});
// 		}
// 		// Now we create a new cart object with the updated array, and save it to the database.
// 		const updatedCart = { items: updatedCartItems };
// 		const db = getDB();
// 		// We are doing the same thing as save(), but I guess for best practice we don't want to expose the whole user to being updated, which could potentially be get slow.
// 		return db
// 			.collection('users')
// 			.updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
// 			.then()
// 			.catch((err) => console.log(err));
// 	}

// 	getCart() {
// 		const db = getDB();
// 		// Here we are constructing an array of just the product ids in the cart so that we can use a mongoDB query operation to find all the products in the cart at once.
// 		const productIds = this.cart.items.map((i) => {
// 			return i.productId;
// 		});
// 		// This find() query operation $in will return a cursor pointing to each item that matches a product id in the provided array. We can simply use the toArray() method to convert all these cursors into an array, since we know there won't be too many to handle at once.
// 		return (
// 			db
// 				.collection('products')
// 				.find({ _id: { $in: productIds } })
// 				.toArray()
// 				// We also need to collect the quantities of each product in the cart.
// 				.then((products) => {
// 					// We do this by adding a quantity property to each of our existing product objects, using the map() and spread operator.
// 					return products.map((p) => {
// 						return {
// 							...p,
// 							// We can then find the quantity for each appropriate product by using the find() method on the user's cart.
// 							// This is acting kinda similar to a nested forEach loop, but it's much faster to type.
// 							quantity: this.cart.items.find((i) => {
// 								return i.productId.toString() === p._id.toString();
// 							}).quantity
// 						};
// 					});
// 				})
// 		);
// 	}

// 	deleteItemFromCart(productId) {
// 		// Just like adding to the cart, we are just creating a new cart object with an updated array of items.
// 		// In this case, we are going to filter the current list by finding every item that does not match the provided id, which will remove the item from the cart.
// 		// This notably doesn't account for simply decreasing the quantity by 1, but that seems to be outside the scope.
// 		const updatedCartItems = this.cart.items.filter(
// 			(i) => i.productId.toString() !== productId.toString()
// 		);

// 		const db = getDB();
// 		return db
// 			.collection('users')
// 			.updateOne(
// 				{ _id: this._id },
// 				{ $set: { cart: { items: updatedCartItems } } }
// 			);
// 	}

// 	// While we are creating orders here, we are going to store them in their own collection on the database, to avoid having too much data embedded on the user.
// 	addOrder() {
// 		const db = getDB();
// 		// Inside the order, we want to store all the product data *at the time of the order*, which means we want to create duplicate data here. Usually, this is a negative, since we would have to update the data whenever it changes, but in this case, we actually want to see old data on orders.
// 		// We already have a method that gets all the products in the cart, so we can just use that.
// 		return (
// 			this.getCart()
// 				.then((products) => {
// 					const order = {
// 						items: products,
// 						// We also want to store information about the user, and how much of that we store is up to us. We definitely nee a reference to the user, but we may also want quick access to some other information as well.
// 						user: {
// 							_id: new mongodb.ObjectId(this._id),
// 							name: this.name
// 						}
// 					};
// 					return db.collection('orders').insertOne(order);
// 				})
// 				// Once the order has been placed, we need to remove all items from the cart, and also make that update on the database.
// 				.then((result) => {
// 					this.cart = { items: [] };
// 					return db
// 						.collection('users')
// 						.updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
// 				})
// 				.catch((err) => console.log(err))
// 		);
// 	}

// 	// This method will be used to find all orders associated with this user.
// 	getOrders() {
// 		const db = getDB();
// 		return db
// 			.collection('orders')
// 			.find({ 'user._id': new mongodb.ObjectId(this._id) })
// 			.toArray()
// 			.catch((err) => console.log(err));
// 	}

// 	static findById(userId) {
// 		const db = getDB();
// 		return db
// 			.collection('users')
// 			.find({ _id: new mongodb.ObjectId(userId) })
// 			.next()
// 			.then((user) => {
// 				return user;
// 			})
// 			.catch((err) => console.log(err));
// 	}
// }

// module.exports = User;
