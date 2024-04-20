const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const saltRounds = 10;

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email format',
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: [2, 'Username should be at least 2 characters'],
        validate: {
            validator: validator.isAlphanumeric,
            message: 'Username only alphanumerical characters'
        }
    },
    password: {
        type: String,
        requred: true,
        minLength: [8, 'Password should be at least 8 characters long'],
        validate: {
            validator: function (value) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(value);
            },
            message: 'Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.',
        }
    },
    image: {
        type: String,
        required: true,
    },
    projects: [{
        type: ObjectId,
        ref: 'Project',
    }],
    token: String,
}, {
    timestamps: { createdAt: 'created_at' }
});

userSchema.methods.matchpassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err)
    }
});

module.exports = mongoose.model('User', userSchema);