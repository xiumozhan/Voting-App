const jwt = require('jsonwebtoken');

module.exports = {
    validate(req, res, next) {
        const token = req.body.token;
        jwt.verify(token, 'freecodecamp', (err, decoded) => {
            if(err) {
                res.status(400).send({
                    message: 'Token Validation Failed',
                    error: err
                });
            } else {
                res.status(200).send({
                    message: 'Token Validation Succeeded',
                    token: decoded
                });
            }
        });
    },

    authenticate(req, res, next) {
        const header = req.headers.authorization;

        if(header) {
            const token = header.split(' ')[1];
            jwt.verify(token, 'freecodecamp', (err, decoded) => {
                if(err) {
                    res.status(400).send({
                        message: 'Token Validation Failed',
                        error: err
                    });
                } else {
                    next();
                }
            });
        } else {
            res.status(400).send({
                message: 'No Token In Request Header'
            })
        }
    }
};
