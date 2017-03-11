const mongoose = require('mongoose');
const validate = require('mongoose-validate');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const REQUIRED_PASSWORD_LENGTH = 10;
const SALT_WORK_FACTOR = 10;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        validate: [validate.email, "Invalid email address"]
    },
    password: {
        type: String,
        required: true,
        validate: [
            (password) => password && password.length >= REQUIRED_PASSWORD_LENGTH,
            "Password length must be no less than" + REQUIRED_PASSWORD_LENGTH
        ]
    }
});

UserSchema.pre('save', function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(this.password, salt, null, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            this.password = hash;
            next();
        });
    });
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
