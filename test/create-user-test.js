const assert = require('assert');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');
const User = mongoose.model('user');

describe('Tests for user creation', () => {

    it('enables POST /api/users to create a new user', (done) => {
        const Xiumo = {
            name: 'xiumozhan',
            email: 'xiumo@test.com',
            password: 'xiumo123123'
        };

        User.count().then((count) => {
            console.log(count);
            request(app)
                .post('/api/users')
                .send(Xiumo)
                .end(() => {
                    User.count().then((newCount) => {
                        assert(newCount === count + 1);
                        done();
                    });
                });
        });
    });

    it('cannot register 2 users with the same name', (done) => {
        const Xiumo = {
            name: 'xiumozhan',
            email: 'xiumozhan@test.com',
            password: 'xiumo123123'
        };

        const anotherXiumo = {
            name: 'xiumozhan',
            email: 'xiumoz@test.com',
            password: 'xiumo123123'
        };

        User.create(Xiumo).then(() => {
            User.create(anotherXiumo).then(() => {
                User.find({}).then((users) => {
                    console.log(users);
                    done();
                });
            })
            .catch((err) => {
                assert(err.message.match('duplicate key error collection'));
                done();
            });
        });
    });

    it('cannot register 2 users with the same email address', (done) => {
        const Xiumo = {
            name: 'xiumoz',
            email: 'xiumoz@test.com',
            password: 'xiumo123123'
        };

        const anotherXiumo = {
            name: 'xiumozhan',
            email: 'xiumoz@test.com',
            password: 'xiumo123123'
        };

        User.create(Xiumo).then(() => {
            User.create(anotherXiumo).then(() => {
                User.find({}).then((users) => {
                    console.log(users);
                    done();
                });
            })
            .catch((err) => {
                assert(err.message.match('duplicate key error collection'));
                done();
            });
        });
    });
});
