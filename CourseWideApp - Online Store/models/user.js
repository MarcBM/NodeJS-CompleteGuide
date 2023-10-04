// So that we can save our objects to the database, we need the connection to the database.
const getDB = require('../util/database').getDB;
const mongodb = require('mongodb');

// Still no authentication, so we are just using a simple user model.
class User {
    constructor(username, email, id) {
        this.name = username;
        this.email = email;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDB();
        let dbOperation;
        if (this._id) {
            dbOperation = db.collection('users').updateOne({ _id: this._id }, { $set: this });
        } else {
            dbOperation = db.collection('users').insertOne(this);
        }
        return dbOperation
            .then()
            .catch(err => console.log(err));
    }

    static findById(userId) {
        const db = getDB();

        return db
            .collection('users')
            .find({ _id: new mongodb.ObjectId(userId) })
            .next()
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }
}

module.exports = User;