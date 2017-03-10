const User = require('../models/User');

module.exports = {
    index(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    },

    create(req, res, next) {
        const userProps = req.body;
        const newUser = new User(userProps);
        newUser.save().then((user) => {
            res.send(user);
        })
        .catch(next);
    }
};
