const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = mongoose.model('user');
const Poll = mongoose.model('poll');
const jwt = require('jsonwebtoken');

describe('Tests for APIs about polls', () => {
    let newUser;

    it('POST /api/polls should create a poll under a given user if authenticated', (done) => {
        newUser = {
            name: 'Joe',
            email: 'joe@fcc.com',
            password: '123123123123'
        };

        //register a new user first, this should return us a valid token
        request(app)
            .post('/api/users')
            .send(newUser)
            .then((response) => {
                const token = response.text;
                return token;
            })
            //Add the provided token in the request header and make a request
            //to create a poll under the name of the newly created user
            .then((token) => {
                return request(app)
                    .post('/api/polls')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        question: 'Which is your favourite programming language?',
                        user: {
                            name: newUser.name
                        }
                    });
            })
            //we should get a response with status code 200 meaning our poll
            //has been successfully created in our database
            .then((response) => {
                const user = response.body;
                assert(response.status === 200);
                //since a new user has no poll at the beginning, now the user should
                //have one poll under his name
                assert(user.polls.length === 1);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
    });

    it('DELETE /api/poll/:id should delete the specified as well as its reference in respective user if authenticated', (done) => {
        //create a user and a one poll under its name first
        //register a new user first, this should return us a valid token
        let token;

        newUser = {
            name: 'Joe',
            email: 'joe@fcc.com',
            password: '123123123123'
        };

        request(app)
            .post('/api/users')
            .send(newUser)
            .then((response) => {
                token = response.text;
                return;
            })
            //Add the provided token in the request header and make a request
            //to create a poll under the name of the newly created user
            .then(() => {
                return request(app)
                    .post('/api/polls')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        question: 'Which is your favourite programming language?',
                        user: {
                            name: newUser.name
                        }
                    });
            })
            //remove the poll
            .then((response) => {
                const newPoll = response.body.polls[0];
                request(app)
                    .delete(`/api/poll/${newPoll}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({})
                    .then((response) => {
                        const pollQuestion = response.body.deleted.question;
                        assert(response.status === 200);
                        assert(pollQuestion === 'Which is your favourite programming language?');
                        return;
                    })
                    //see if the deleted poll's reference still exists in user
                    .then(() => {
                        User.findOne({ name: newUser.name })
                            .then((user) => {
                                assert(user.polls.length === 0);
                                done();
                            });
                    });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
    });

    it('POST /api/polls should not create a poll under a given user without a token', (done) => {
        newUser = {
            name: 'Joe',
            email: 'joe@fcc.com',
            password: '123123123123'
        };

        //register a new user first, this should return us a valid token
        request(app)
            .post('/api/users')
            .send(newUser)
            .then((response) => {
                const token = response.text;
                return token;
            })
            //try to make the create poll request without adding a token in the header
            .then((token) => {
                return request(app)
                    .post('/api/polls')
                    .send({
                        question: 'Which is your favourite programming language?',
                        user: {
                            name: newUser.name
                        }
                    });
            })
            //we should get a response with status code 400 meaning our request
            //failed and a message showing we didn't provide a token at all
            .then((response) => {
                const message = response.body.message;
                assert(response.status === 400);
                assert(message === 'No Token In Request Header');
                return;
            })
            //go to our database and we should see neither that poll nor its reference
            //under the newly created user's name has been created
            .then(() => {
                const pollQuery = Poll.findOne({ question: 'Which is your favourite programming language?' });
                const userQuery = User.findOne({ name: 'Joe' });
                return Promise.all([pollQuery, userQuery]);
            })
            .then(([poll, user]) => {
                assert(poll === null)
                assert(user.polls.length === 0);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
    });

    it('DELETE /api/poll/:id should not delete the specified as well as its reference in respective user without a token', (done) => {
        //create a user and a one poll under its name first
        //register a new user first, this should return us a valid token
        newUser = {
            name: 'Joe',
            email: 'joe@fcc.com',
            password: '123123123123'
        };

        let token;

        request(app)
            .post('/api/users')
            .send(newUser)
            .then((response) => {
                token = response.text;
                return;
            })
            //Add the provided token in the request header and make a request
            //to create a poll under the name of the newly created user
            .then(() => {
                return request(app)
                    .post('/api/polls')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        question: 'Which is your favourite programming language?',
                        user: {
                            name: newUser.name
                        }
                    });
            })
            //try remove the poll without including any token in the request header
            .then((response) => {
                const newPoll = response.body.polls[0];
                request(app)
                    .delete(`/api/poll/${newPoll}`)
                    .send({})
                    //we should get a response with status code 400 meaning our request
                    //failed and a message showing we didn't provide a token at all
                    .then((response) => {
                        const message = response.body.message;
                        assert(response.status === 400);
                        assert(message === 'No Token In Request Header');
                        return;
                    })
                    //go to our database and we should see neither that poll nor its reference
                    //under the newly created user's name has been removed
                    .then(() => {
                        const pollQuery = Poll.findOne({ question: 'Which is your favourite programming language?' });
                        const userQuery = User.findOne({ name: 'Joe' });
                        return Promise.all([pollQuery, userQuery]);
                    })
                    .then(([poll, user]) => {
                        assert(poll !== null);
                        assert(user.polls.indexOf(poll._id) === 0);
                        done();
                    });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
    });

    it('POST /api/polls should not create a poll under a given user with an invalid token', (done) => {
        newUser = {
            name: 'Joe',
            email: 'joe@fcc.com',
            password: '123123123123'
        };

        //register a new user first, this should return us a valid token
        request(app)
            .post('/api/users')
            .send(newUser)
            .then((response) => {
                const token = response.text;
                return token;
            })
            //try to make the create poll request without adding a token in the header
            .then((token) => {
                token += 'fcc';
                return request(app)
                    .post('/api/polls')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        question: 'Which is your favourite programming language?',
                        user: {
                            name: newUser.name
                        }
                    });
            })
            //we should get a response with status code 400 meaning our request
            //failed and a message showing we didn't provide a token at all
            .then((response) => {
                const message = response.body.message;
                assert(response.status === 400);
                assert(message === 'Token Validation Failed');
                return;
            })
            //go to our database and we should see neither that poll nor its reference
            //under the newly created user's name has been created
            .then(() => {
                const pollQuery = Poll.findOne({ question: 'Which is your favourite programming language?' });
                const userQuery = User.findOne({ name: 'Joe' });
                return Promise.all([pollQuery, userQuery]);
            })
            .then(([poll, user]) => {
                assert(poll === null)
                assert(user.polls.length === 0);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
    });

    it('DELETE /api/poll/:id should not delete the specified as well as its reference in respective user with an invalid token', (done) => {
        //create a user and a one poll under its name first
        //register a new user first, this should return us a valid token
        newUser = {
            name: 'Joe',
            email: 'joe@fcc.com',
            password: '123123123123'
        };

        let token;

        request(app)
            .post('/api/users')
            .send(newUser)
            .then((response) => {
                token = response.text;
                return;
            })
            //Add the provided token in the request header and make a request
            //to create a poll under the name of the newly created user
            .then(() => {
                return request(app)
                    .post('/api/polls')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        question: 'Which is your favourite programming language?',
                        user: {
                            name: newUser.name
                        }
                    });
            })
            //try remove the poll without including any token in the request header
            .then((response) => {
                token += 'fcc';
                const newPoll = response.body.polls[0];
                request(app)
                    .delete(`/api/poll/${newPoll}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({})
                    //we should get a response with status code 400 meaning our request
                    //failed and a message showing we didn't provide a token at all
                    .then((response) => {
                        const message = response.body.message;
                        assert(response.status === 400);
                        assert(message === 'Token Validation Failed');
                        return;
                    })
                    //go to our database and we should see neither that poll nor its reference
                    //under the newly created user's name has been removed
                    .then(() => {
                        const pollQuery = Poll.findOne({ question: 'Which is your favourite programming language?' });
                        const userQuery = User.findOne({ name: 'Joe' });
                        return Promise.all([pollQuery, userQuery]);
                    })
                    .then(([poll, user]) => {
                        assert(poll !== null);
                        assert(user.polls.indexOf(poll._id) === 0);
                        done();
                    });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
    });
});
