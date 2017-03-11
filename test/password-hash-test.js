const assert = require('assert');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const User = mongoose.model('user');

describe('Tests for password hashing', () => {
    const Xiumo = {
        name: 'xiumo',
        email: 'xiumozhan@gmail.com',
        password: 'xiumo123123'
    };

    it('original password doesn\'t look like hashed password', (done) => {
        User.create(Xiumo).then((user) => {
            assert(user.password !== Xiumo.password);
            done();
        });
    });

    it('original password looks like hashed password when using compare', (done) => {
        User.create(Xiumo).then((user) => {
            bcrypt.compare(Xiumo.password, user.password, (error, result) => {
                assert(result === true);
                done();
            })
        });
    });
});
