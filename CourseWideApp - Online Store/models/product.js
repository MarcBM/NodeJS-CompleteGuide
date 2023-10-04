// So that we can save our objects to the database, we need the connection to the database.
const getDB = require('../util/database').getDB;
const mongodb = require('mongodb');

// Since MongoDB uses a data format similar to JSON, we can simply create standard JavaScript objects which will be serialized by MongoDB.
class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    // This method is used to save the object to the database.
    save() {
        const db = getDB();
        // This variable will be used to return a specific operation that we would like to perform on the database. It will be used to either create a new product or update an existing product.
        let dbOperation;
        // If the product already has an _id, that means we have already saved it to the database, so we are now updating it.
        if (this._id) {
            // Similar to below, we are accessing the products collection, then calling the updateOne() method. This method requires a comparison query to find the document to update, then an update command which we are saying is to $set all values to this object's current values.
            dbOperation = db.collection('products').updateOne({ _id: this._id }, { $set: this });
        } else {
            // Here we instruct MongoDB to access a collection. These collections do not need to be created ahead of time, if they do not exist, they will be created.
            // The insertOne method allows us to insert an object into the collection. This method also returns a promise.
            dbOperation = db.collection('products').insertOne(this);
        }
        // We return this whole thing since this will be used in the controller as part of a promise chain.
        return dbOperation
            .then()
            .catch(err => console.log(err));
    }

    // Since we are using the document model in MongoDB, our db models can be created pretty much identically to any class you might use purely in runtime. We can bundle all our methods within the class they relate to.
    static fetchAll() {
        const db = getDB();
        // The toArray method is provided by MongoDB to convert the cursor into an array of objects. We should only use this if we know we have a strictly limited amount of data in the collection.
        return db
            .collection('products')
            // The find method does not return an array of objects, but instead a cursor pointing at the first document in the collection. This stops us from accidentally loading insane amounts of data at once.
            .find()
            // The toArray method is provided by MongoDB to convert the cursor into an array of objects. We should only use this if we know we have a strictly limited amount of data in the collection.
            .toArray()
            .then(products => {
                // console.log(products);
                return products;
            })
            .catch(err => console.log(err));
    }

    static findById(prodId) {
        const db = getDB();
        return db
            .collection('products')
            // We will retrieve a cursor pointing at the first document with a matching _id.
            // To be able to properly find the document, we need to pass an ObjectID object instead of the raw ID.
            .find({ _id: new mongodb.ObjectId(prodId) })
            // next() gives us the next document in the collection that matched the query. We know that there will only be one matching document, so we can just take the result of next() as our found product.
            .next()
            .then(product => {
                // console.log(product);
                return product;
            })
            .catch(err => console.log(err));
    }

    // Static method for deletion is prefered since its kinda bad practice to delete something using itself.
    static deleteById(prodId) {
        const db = getDB();
        // We are again returning a db operation.
        return db
            // Step 1 - Access the collection.
            .collection('products')
            // Step 2 - Call a command.
            // The DeleteOne method is similar to the updateOne method, but all we need this time is the filter object to find the correct document to delete.
            // We have to convert the prodId to a propert ObjectId since we are just getting the id as an argument, and not using a product object itself.
            .deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then(() => console.log('Deleted Product!'))
            .catch(err => console.log(err));
    }
}

module.exports = Product;