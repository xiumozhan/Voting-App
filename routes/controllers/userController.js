const User = require('../../models/User');

module.exports = {
    greeting(req, res, next) {
        res.send('Hi' + req.body);
    },

    printId(req, res, next) {
        res.send(req.params.id);
    },

    create(req, res, next) {
        const userProps = req.body;
        const newUser = new User(userProps);
        newUser.save().then((user) => {
            res.send(user);
        })
        .catch(next);
    }
}
