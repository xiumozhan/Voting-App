const mongoose = require('mongoose');

before((done) => {
    console.log('Currently in', process.env.NODE_ENV, 'environment');
    mongoose.connect('mongodb://localhost/voting_test');
    mongoose.connection
        .once('open', () => done())
        .on('error', (err) => {
            console.warn('Warning', err);
        })
});

beforeEach((done) => {
    const users = mongoose.connection.collections.users;
    users.drop()
        .then(() => done())
        .catch(() => done());
});
