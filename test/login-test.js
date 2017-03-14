const assert = require('assert');
const request = require('supertest');
const bcrypt = require('bcrypt-nodejs');
const app = require('../server');
const mongoose = require('mongoose');

const User = mongoose.model('user');

describe('create a user first and test its login validation process', () => {
    const Xiumo = {
        name: 'xiumozhan',
        email: 'xiumo@fcc.com',
        password: '123123123123'
    };

    it('enables a user to login using correct username and password', (done) => {
        User.create(Xiumo).then(() => {
            request(app)
                .post('/api/login')
                .send({
                    usernameOrEmail: Xiumo.name,
                    password: Xiumo.password
                })
                .then((res) => {
                    assert(res.status === 200);
                    done();
                });
        });
    });

    it('enables a user to login using correct email address and password', (done) => {
        User.create(Xiumo).then(() => {
            request(app)
                .post('/api/login')
                .send({
                    usernameOrEmail: Xiumo.email,
                    password: Xiumo.password
                })
                .then((res) => {
                    assert(res.status === 200);
                    done();
                });
        });
    });

    it('stops a user from logging in with unregistered username', (done) => {
        User.create(Xiumo).then(() => {
            request(app)
                .post('/api/login')
                .send({
                    usernameOrEmail: 'xiumoz',
                    password: Xiumo.password
                })
                .then((res) => {
                    console.log(res.body);
                    assert(res.body.valid === false && res.body.user === undefined && res.status === 400);
                    done();
                });
        });
    });

    it('stops a user from logging in with unregistered email', (done) => {
        User.create(Xiumo).then(() => {
            request(app)
                .post('/api/login')
                .send({
                    usernameOrEmail: 'xiumoz@fcc.com',
                    password: Xiumo.password
                })
                .then((res) => {
                    console.log(res.body);
                    assert(res.body.valid === false && res.body.user === undefined && res.status === 400);
                    done();
                });
        });
    });

    it('stops a user from logging in with incorrect password', (done) => {
        User.create(Xiumo).then(() => {
            request(app)
                .post('/api/login')
                .send({
                    usernameOrEmail: Xiumo.name,
                    password: '1231231231'
                })
                .then((res) => {
                    console.log(res.body);
                    assert(res.body.valid === false && res.body.user === true && res.status === 400);
                    done();
                });
        });
    });
});
