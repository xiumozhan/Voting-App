const User = require('../../models/User');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

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
            const token = jwt.sign(
                { user: user },
                'freecodecamp',
                { expiresIn: 7200 }
            );
            res.status(201).send(token);
        })
        .catch(next);
    },

    verify(req, res, next) {
        const userInfo = req.body;
        User.findOne({
            $or: [
                { name: userInfo.usernameOrEmail },
                { email: userInfo.usernameOrEmail }
            ]
        })
        .then((user) => {
            if(user) {
                bcrypt.compare(userInfo.password, user.password, (error, result) => {
                    if(result) {
                        const token = jwt.sign(
                            { user: user },
                            'freecodecamp',
                            { expiresIn: 7200 }
                        );
                        res.status(200).send(token);
                    } else {
                        res.status(400).send({ valid: false, user: true });
                    }
                });
            } else {
                res.status(400).send({ valid: false});
            }
        })
        .catch(next);
    }
}
