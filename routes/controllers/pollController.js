const Poll = require('../../models/poll');
const User = require('../../models/User');

module.exports = {
    getAllPolls(req, res, next) {
        Poll.find({})
            .then((polls) => {
                res.status(200).json(polls);
            })
            .catch(next);
    },

    create(req, res, next) {
        let pollProps;
        pollProps = req.body;
        const user = pollProps.user;
        delete pollProps.user;
        const pollQuery = Poll.create(pollProps);
        const userQuery = User.findOne(user);

        Promise.all([pollQuery, userQuery])
            .then(([poll, user]) => {
                user.polls.push(poll);
                return user.save();
            })
            .then((user) => {
                console.log(user);
                res.status(200).send(user);
            })
            .catch(next);
    },

    getPollById(req, res, next) {
        Poll.findOne({ _id: req.params.id })
            .then((poll) => {
                res.status(200).json(poll);
            })
            .catch((err) => {
                if(err) {
                    console.log(err);
                    res.status(404).json(err);
                }
                next();
            });
    }
};
