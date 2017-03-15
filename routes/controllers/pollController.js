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
                    // console.log(ops);
                    user.polls.push(poll);
                    ops.forEach((op) => {
                        poll.options.push(op._id);
                        // console.log(poll.options);
                    })
                    return Promise.all([user.save(), poll.save()]);
                })
                .then(([user, poll]) => {
                    console.log(user);
                    res.status(200).send(user);
                })
                .catch(next);
        }

    },

    getPollById(req, res, next) {
        Poll.findOne({ _id: req.params.id })
            .populate({
                path: 'options'
            })
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

    getPollsByUser(req, res, next) {
        User.findById(req.query.id)
            .populate({
                path: 'polls'
            })
            .then((user) => {
                res.status(200).send(polls);
            })
            .catch((err) => {
                console.log(err);
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
    },

    addOption(req, res, next) {
        let optionQuery;
        const options = req.body.options;
        const pollQuery = Poll.findById(req.params.id);
        if(Array.isArray(options)) {
            optionQuery = Option.create(options);
        } else {
            optionQuery = Option.insertMany(options);
        }

        Promise.all([optionQuery, pollQuery])
            .then(([options, poll]) => {
                if(Array.isArray(options)) {
                    options.forEach((op) => {
                        poll.options.push(op._id);
                    });
                } else {
                    poll.options.push(op._id);
                }
                return poll.save();
            })
            .then((poll) => {
                res.status(201).send({
                    message: 'Successfully Added Option(s)',
                    poll: poll,
                });
            })
            .catch((err) => {
                console.log(err);
                next();
            });
    }
};
