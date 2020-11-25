const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstN: String,
    lastN: String,
    email: {type: String, unique: true},
    password: String,
    guest: {
        type: Boolean,
        default: () => {
            return !!this.email;
        }
    },
    role: {type: String, enum: ['CUSTOMER', 'MANAGER', 'ADMIN'], default: 'CUSTOMER'}
}, {timestamps: true})

const sessionSchema = new mongoose.Schema({
    expireAt: {
        type: Date,
        default: function () {
            if (this.userId) {
                return null
            } else {
                // 60 seconds from now  === 60000
                return new Date(new Date().valueOf() + 3600000);
            }
        }
    }
}, {timestamps: true})
sessionSchema.index({expireAt: 1}, {expireAfterSeconds: 0});


const refreshTokenSchema = new mongoose.Schema({
    token: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    expireAt: {type: Date, default: new Date(new Date().valueOf() + (1000 * 60 * 5))},
}, {timestamps: true})
refreshTokenSchema.index({expireAt: 1}, {expireAfterSeconds: 0});

module.exports = {
    User: mongoose.model('User', userSchema),
    Session: mongoose.model('Session', sessionSchema),
    RefreshToken: mongoose.model('RefreshToken', refreshTokenSchema)
}