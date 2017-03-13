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
    const polls = mongoose.connection.collections.polls;
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
        .then(() => {
            polls.drop()
                .then(() => done())
                .catch(() => done());
        })
        .catch((err) => {
            console.log("error dropping users collection", err);
            return done();
        });
});
