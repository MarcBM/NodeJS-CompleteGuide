// As we are creating a SQL model, we need to import the Sequelize library.
const Sequelize = require('sequelize');
// We need to create a connection to the database.
const sequelize = require('../util/database');
// This is the definition of the model. In this case, we are creating a table to model products.
const Product = sequelize.define('product', {
    // Each element of the model represents a column in the database.
    // In this case, we are creating an id, title, price, image url, and description.
    id: {
        // Each element must have a type, but this is the only required field.
        type: Sequelize.INTEGER,
        // The auto-increment option defaults to false, but when enabled will set the first row to 1, and then increment by 1 afterwards, ensuring that each id is unique.
        autoIncrement: true,
        // We want to ensure that each row contains an id, so we do not allow null values.
        allowNull: false,
        // Each table in SQL must have a primary key, and in this case, the ID field is used as it will be unique, and used to search the database.
        primaryKey: true
    },
    // If you only want to set a type for a column, you can use the following syntax.
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;