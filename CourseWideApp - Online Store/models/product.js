// This file will model a single 'product' entity.
// This is where our OO Programming works.

// We used to use an array to store all of our products, but it is much better to use a file instead.
// Eventually, we will implement a proper database to house all of the data, but for now a file will do.
// const products = [];

// Core Node Modules.
const fs = require('fs');
const path = require('path');
const { threadId } = require('worker_threads');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    })
}

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            // Sneaky tiny arrow function magics... One liner has implicit return statement.
            const product = products.find(p => p.id === id);
            cb(products);
        });
    }
};