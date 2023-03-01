// This file will model a single 'product' entity.
// This is where our OO Programming works.

// We used to use an array to store all of our products, but it is much better to use a file instead.
// Eventually, we will implement a proper database to house all of the data, but for now a file will do.
// const products = [];

// Core Node Modules.

const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        
    }

    static deleteById(id) {
        
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        
    }
};