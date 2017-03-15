const express = require('express');
const userController = require('./controllers/userController');
const pollController = require('./controllers/pollController');
const tokenController = require('./controllers/tokenController');

module.exports = (app) => {
    app.get('/api', userController.greeting),

    app.post('/api/users', userController.create),

    app.get('/api/user/polls', pollController.getPollsByUser),

    app.post('/api/login', userController.verify),

    app.post('/api/polls', tokenController.authenticate, pollController.create),

    app.get('/api/polls', pollController.getAllPolls),

    app.get('/api/poll/:id', pollController.getPollById),

    app.delete('/api/poll/:id', tokenController.authenticate, pollController.deletePollById),

    app.post('/api/token', tokenController.validate),

    app.post('/api/poll/:id', tokenController.authenticate, pollController.addOption)
};
