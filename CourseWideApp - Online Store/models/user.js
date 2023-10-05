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
	const cartProductIndex = this.cart.items.findIndex(cp => {
		return cp.productId.toString() === product._id.toString();
	});

	let newQuantity = 1;
	const updatedCartItems = [...this.cart.items];

	if (cartProductIndex >= 0) {
		newQuantity = this.cart.items[cartProductIndex].quantity + 1;
		updatedCartItems[cartProductIndex].quantity = newQuantity;
	} else {
		updatedCartItems.push({
			productId: product._id,
			quantity: newQuantity
		});
	}

	const updatedCart = {
		items: updatedCartItems
	};
	this.cart = updatedCart;

	return this.save().catch(err => {
		console.log(err);
	});
};

userSchema.methods.removeFromCart = function (productId) {
	const updatedCartItems = this.cart.items.filter(item => {
		return item.productId.toString() !== productId.toString();
	});
	this.cart.items = updatedCartItems;
	return this.save().catch(err => {
		console.log(err);
	});
};

userSchema.methods.clearCart = function () {
	this.cart = { items: [] };
	return this.save().catch(err => {
		console.log(err);
	});
};

module.exports = mongoose.model('User', userSchema);
