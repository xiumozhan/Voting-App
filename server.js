const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const routes = require('./routes/routes');
const app = express();
const db = "mongodb://localhost/voting";

if(process.env.NODE_ENV !== 'test') {
    console.log('Currently in Dev environment');

    mongoose.connect(db, (err) => {
        if(err) {
            console.warn(err);
        }
    });

    const dbConnection = mongoose.connection;

    dbConnection.once('open', () => {
        console.log('Successfully connected to', db);
    });

    dbConnection.on('disconnected', () => {
        console.log('Successfully disconnected from', db);
    });

    dbConnection.on('error', (err) => {
        console.warn('Warning:', err);
    });
}

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
routes(app);

module.exports = app;
