const Poll = require('../../models/poll');
const User = require('../../models/User');
const Option = require('../../models/option');

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
        let options;

        pollProps = req.body;
        const user = pollProps.user;

        if(pollProps.options !== undefined) {
            options = pollProps.options;
            delete pollProps.options;
        } else {
            options = [];
        }

        delete pollProps.user;
        const pollQuery = Poll.create(pollProps);
        const userQuery = User.findOne(user);

        if(options.length === 0) {
            Promise.all([pollQuery, userQuery])
                .then(([poll, user]) => {
                    // console.log(options);
                    user.polls.push(poll);
                    return user.save();
                })
                .then((user) => {
                    console.log(user);
                    res.status(200).send(user);
                })
                .catch(next);
        } else {
            const optionQuery = Option.insertMany(options);

            Promise.all([pollQuery, userQuery, optionQuery])
                .then(([poll, user, ops]) => {
                    console.log(ops);
                    user.polls.push(poll);
                    return user.save();
                })
                .then((user) => {
                    console.log(user);
                    res.status(200).send(user);
                })
                .catch(next);
        }

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
    },

    deletePollById(req, res, next) {
        Poll.findById(req.params.id)
            .then((poll) => poll.remove())
            .then((poll) => {
                res.status(200).send({
                    message: 'Successfully Deleted Specified Poll',
                    deleted: poll
                });
            })
            .catch((err) => {
                if(err) {
                    res.status(404).json(err);
                }
                next();
            });
    }
};
