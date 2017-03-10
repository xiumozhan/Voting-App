const userController = require('../controllers/userController');

module.exports = (app) => {
    app.get('*', userController.index);

    app.post('/api/users', userController.create);
};
