const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = mongoose.model('user');
const Poll = mongoose.model('poll');
const jwt = require('jsonwebtoken');

describe('Tests for the concurrency of the database operations', () => {
    const newUser = {
        name: 'Mary',
        email: 'mary@fcc.com',
        password: 'mary123123123'
    };

    const newPoll = {
        question: "What's your favourite color?",
    };

    const newOption = [
        { name: 'red' }
    ];

    it('should increase n on voting count after n parallel votes on one option', (done) => {

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
            //create a poll
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
            //add an option for that poll
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
                var concurrency = [];
                const optionId = response.body.poll.options[0]._id;
                for(var i = 0; i < 5; i++) {
                    concurrency.push(request(app).put(`/api/option/${optionId}`).send({}));
                }

                return Promise.all(concurrency);
            })
            .then(() => request(app).get(`/api/poll/${pollId}`))
            .then((response) => {
                assert(response.body.options[0].count === 5);
                done();
            });
    });
});
