// Final Database Migration - Onto Mongoose Syntax for MongoDB.
const mongoose = require('mongoose');

// Schemas in Mongoose work similarly to those in SQL. We define a data schema for our objects, predefining the data and types. This allows us to let mongoose manage much of the data logic for us since it can assume what our data will look like. That doesn't mean that we are fully restricted to our schema, we can still work with MongoDB's schemaless qualities, but most of the time our data will indeed have a consistent schema, so we might as well make use of the efficiency that affords us.
const Schema = mongoose.Schema;

// Here is our product schema definition. Each property must be given a name and a type, but everything else is optional. We have strictly defined every property as being required, but by default, they are not.
const productSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	imageUrl: {
		type: String,
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		// This field specifies the type of reference we are storing on this document, giving Mongoose a direct understanding of the relationship between the models.
		ref: 'User',
		required: true
	}
});

// Mongoose also makes use of models, which is what we will actually interact with inside our app logic. All this function does is to link up a schema with a name, which is typically started with a capital letter.
module.exports = mongoose.model('Product', productSchema);
