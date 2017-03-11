const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    const Option = mongoose.model('option');

    Option.remove({
        _id: {
            $in: this.options
        }
    })
    .then(() => next());
});

const Poll = mongoose.model('poll', PollSchema);

module.exports = Poll;
