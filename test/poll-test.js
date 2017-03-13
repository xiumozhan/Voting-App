const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = mongoose.model('user');
const Poll = mongoose.model('poll');

describe('Tests for APIs about polls', () => {
    let newUser;

    it('POST /api/polls should create a poll under a given user', (done) => {
        newUser = {
            name: 'Joe',
            email: 'joe@fcc.com',
            password: '123123123123'
        };

        User.create(newUser)
            .then((user) => {
                assert(user.polls.length === 0);
                return request(app)
                    .post('/api/polls')
                    .send({
                        question: 'Which is your favourite programming language?',
                        user: {
                            name: newUser.name
                        }
                    })
            })
            .then((response) => {
                const newPolls = response.body.polls;
                assert(newPolls.length === 1);
                done();
            });
    });

    it('DELETE /api/poll/:id should delete the specified as well as its reference in respective user', (done) => {
        //create a user and a one poll under its name first
        User.create(newUser)
            .then((user) => {
                return request(app)
                    .post('/api/polls')
                    .send({
                        question: 'Which is your favourite programming language?',
                        user: {
                            name: newUser.name
                        }
                    })
            })
            //remove the poll
            .then((response) => {
                const newPoll = response.body.polls[0];
                request(app)
                    .delete(`/api/poll/${newPoll}`)
                    .send({})
                    //see if the deleted poll's reference still exists in user
                    .end(() => {
                        User.findOne({ name: newUser.name })
                            .then((user) => {
                                assert(user.polls.length === 0);
                                done();
                            });
                    });
            });
    });
});
