const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const noAdjacentInlineElements = require('eslint-plugin-react/lib/rules/no-adjacent-inline-elements');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name !']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email !']
    },
    role: {
        type: String,
        enum: ['guide', 'lead-guide','admin', 'user'],
        default: 'user'
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Enter password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        //this will only works on create and save
        type: String,
        validate: {
            validator: function (el) {
                return this.password === el;
            },
            message: "Passwords are not the same"
        }
    },
    passwordChangedAt: Date
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    //delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, 10
        )
        return JWTTimeStamp < changedTimeStamp;
    }

    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;