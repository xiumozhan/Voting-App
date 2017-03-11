const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OptionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    }
});

const Option = mongoose.model('option', OptionSchema);

module.exports = Option;
