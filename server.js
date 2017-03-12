const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const mongoose = require('mongoose');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('short'))
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
router(app);
app.get("*", function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

app.listen('5000', () => {
    console.log('Listening on port: 5000');
})

module.exports = app;
