// This file will model a single 'product' entity.
// This is where our OO Programming works.

const products = [];

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        products.push(this);
    }

    static fetchAll() {
        return products;
    }
}