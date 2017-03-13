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

    const createUser = User.create(Xiumo);

    it('enables a user to login using correct username and password', (done) => {
        createUser.then(() => {
            request(app)
                .post('/api/login')
                .send({
                    usernameOrEmail: Xiumo.name,
                    password: Xiumo.password
                })
                .end((res) => {
                    assert(res.data.valid === true && res.status === 200);
                    done();
                });
        });
    });

    it('enables a user to login using correct email address and password', (done) => {
        createUser.then(() => {
            request(app)
                .post('/api/login')
                .send({
                    usernameOrEmail: Xiumo.email,
                    password: Xiumo.password
                })
                .end((res) => {
                    assert(res.data.valid === true && res.status === 200);
                    done();
                });
        });
    });

    it('stops a user from logging in with unregistered username', (done) => {
        createUser.then(() => {
            request(app)
                .post('/api/login')
                .send({
                    usernameOrEmail: 'xiumoz',
                    password: Xiumo.password
                })
                .end((res) => {
                    assert(res.data.valid === false && res.status === 400);
                    done();
                });
        });
    });

    it('stops a user from logging in with unregistered email', (done) => {
        createUser.then(() => {
            request(app)
                .post('/api/login')
                .send({
                    usernameOrEmail: 'xiumoz@fcc.com',
                    password: Xiumo.password
                })
                .end((res) => {
                    assert(res.data.valid === false && res.status === 400);
                    done();
                });
        });
    });

    it('stops a user from logging in with incorrect password', (done) => {
        createUser.then(() => {
            request(app)
                .post('/api/login')
                .send({
                    usernameOrEmail: Xiumo.name,
                    password: '1231231231'
                })
                .end((res) => {
                    assert(res.data.valid === false && res.status === 400);
                    done();
                });
        });
    });
});
