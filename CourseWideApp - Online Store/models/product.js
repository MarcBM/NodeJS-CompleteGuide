// So that we can save our objects to the database, we need the connection to the database.
const getDB = require('../util/database').getDB;

// Since MongoDB uses a data format similar to JSON, we can simply create standard JavaScript objects which will be serialized by MongoDB.
class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    // This method is used to save the object to the database.
    save() {
        const db = getDB();
        // Here we instruct MongoDB to access a collection. These collections do not need to be created ahead of time, if they do not exist, they will be created.
        // The insertOne method allows us to insert an object into the collection. This method also returns a promise.
        // We return this whole thing since this will be used in the controller as part of a promise chain.
        return db.collection('products')
            .insertOne(this)
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }
}

module.exports = Product;