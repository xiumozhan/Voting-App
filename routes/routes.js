const indexController = require('../controllers/node-controllers/indexController');

module.exports = (app) => {
    app.get('/', indexController.greeting);
};
