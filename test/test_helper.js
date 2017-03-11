const mongoose = require('mongoose');

before((done) => {
    console.log('Currently in', process.env.NODE_ENV, 'environment');
    mongoose.connect('mongodb://localhost/voting_test');
    mongoose.connection
        .once('open', () => {
            console.log('Successfully connected to mongodb://localhost/voting_test');
            return done();
        })
        .on('error', (err) => {
            console.warn('Warning', err);
        })
});

beforeEach((done) => {
    const users = mongoose.connection.collections.users;
    users.drop()
        .then(() => users.ensureIndex({
            'name': 1
        }, {
            unique: true
        }))
        .then(() => users.ensureIndex({
            'email': 1
        }, {
            unique: true
        }))
        .then(() => done())
        .catch((err) => {
            console.log("error droping collection", err);
            return done();
        });
});
