// Here we import the mongodb library
const mongodb = require('mongodb');

// From the mongodb library, we create an instance of the MongoClient.
const MongoClient = mongodb.MongoClient;

// So we can expose our connection logic to app.js, we are wrapping it in an arrow function, which takes a callback that will be able to use the resulting client, allowing us to access the database.
const mongoConnect = callback => {
    // To connect to the database, all we need to do is use the connect method. This method returns a promise, which we are familiar with at this point.
    MongoClient.connect(
        'mongodb+srv://marcbetbeder:k5QfYL8s8UnKlZvs@cluster0.9h8qw14.mongodb.net/?retryWrites=true&w=majority'
    )
        .then(client => {
            console.log('Connected to MongoDB');
            callback(client);
        })
        .catch(err => console.error(err));
}

module.exports = mongoConnect;