const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./User');
require('./option');

const PollSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    options: [{
        type: Schema.Types.ObjectId,
        ref: 'option'
    }]
});

PollSchema.pre('remove', function(next) {
    console.log('Removing options in the specified poll...');
    const Option = mongoose.model('option');

    Option.remove({
        _id: {
            $in: this.options
        }
    })
    .then(() => next());
});

PollSchema.pre('remove', function(next) {
    console.log('Removing poll reference in respective user...');
    const User = mongoose.model('user');

    User.update(
        {  },
        { $pull: { polls: this._id } },
        { multi: true }
    )
    .then(() => next());
});

const Poll = mongoose.model('poll', PollSchema);

module.exports = Poll;
