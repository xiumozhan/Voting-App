const express = require('express');
const userController = require('./controllers/userController');

module.exports = (app) => {
    app.get('/api', userController.greeting),

    app.get('/api/:id', userController.printId),

    app.post('/api/users', userController.create)

};
