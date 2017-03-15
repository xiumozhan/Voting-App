const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = mongoose.model('user');
const Poll = mongoose.model('poll');
const Option = mongoose.model('option');
const jwt = require('jsonwebtoken');

describe('Tests for adding options to a poll', () => {
    const newUser = {
        name: 'Joe',
        email: 'joe@fcc.com',
        password: '123123123123'
    };

    const newPoll = {
        question: "What's your favourite color?",
    };

    const newOption = [
        { name: 'red' },
        { name: 'blue' },
        { name: 'green' },
        { name: 'yellow' }
    ];

    it('POST /api/polls should create a bunch of options and their references in the poll upon the creation of a poll if options are specified in the API request', (done) => {
        let token;
        //create a user first
        request(app)
            .post('/api/users')
            .send(newUser)
            .then((response) => {
                token = response.text;
                return token;
            })
            //create a poll with several options
            .then((token) => {
                return request(app)
                    .post('/api/polls')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        question: newPoll.question,
                        options: newOption,
                        user: {
                            name: newUser.name
                        }
                    });
            })
            .then((response) => {
                return Poll.findById(response.body.polls[0])
            })
            .then((poll) => {
                assert(poll.options.length === 4);
                return Option.find({
                    _id: { $in: poll.options }
                });
            })
            .then((options) => {
                assert(options.length === 4);
                done();
            });
    });

    it('POST /api/poll/:id should create a bunch of options and their references in the poll afterwards', (done) => {
        let token;
        let pollId;
        //create a user first
        request(app)
            .post('/api/users')
            .send(newUser)
            .then((response) => {
                token = response.text;
                return token;
            })
            //create an empty poll
            .then((token) => {
                return request(app)
                    .post('/api/polls')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        question: newPoll.question,
                        user: {
                            name: newUser.name
                        }
                    });
            })
            //add options afterwards
            .then((response) => {
                pollId = response.body.polls[0];
                return request(app)
                    .post(`/api/poll/${pollId}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        options: newOption
                    });
            })
            .then((response) => {
                assert(response.body.message === 'Successfully Added Option(s)');
                assert(response.body.poll.options.length === 4);
                return Option.find({
                    _id: { $in: response.body.poll.options }
                });
            })
            .then((options) => {
                assert(options.length === 4);
                done();
            });
    });
});
