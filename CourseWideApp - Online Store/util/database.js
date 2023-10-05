// Here we import the mongodb library
const mongodb = require('mongodb');

// From the mongodb library, we create an instance of the MongoClient.
const MongoClient = mongodb.MongoClient;

// So that we can read my DBURL file.
const fs = require('fs');

const dbURL = fs.readFileSync('dbURL.txt', 'utf8').toString();

// Here we are storing a connection to the database so that we can access it without having to reconnect every time.
let _db;

// So we can expose our connection logic to app.js, we are wrapping it in an arrow function, which takes a callback that will be able to use the resulting client, allowing us to access the database.
const mongoConnect = (callback) => {
	// To connect to the database, all we need to do is use the connect method. This method returns a promise, which we are familiar with at this point.
	MongoClient.connect(
		// We need to pass the url of the database in here. For more security, this is stored in a txt file stored only locally. To migrate this project properly, make sure this txt file exists in the same folder as app.js.
		dbURL
	)
		.then((client) => {
			console.log('Connected to MongoDB');
			_db = client.db();
			callback();
		})
		.catch((err) => console.error(err));
};

// Now we provide a function that will give us the connection to the database.
const getDB = () => {
	if (_db) {
		return _db;
	}
	throw 'No connection to database!';
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
