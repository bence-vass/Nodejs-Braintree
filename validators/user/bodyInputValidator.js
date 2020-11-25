const { body } = require('express-validator');
const {User} = require('../../models/User')

exports.registerUserValidator = [
    body('email').isEmail().normalizeEmail().custom(value => {
        return User.findOne({email: value}).then(user => {
            if(user){
                return Promise.reject('E-mail already in use');
            }
        })
    }),
    body('password').isLength({min: 5, max:50}),
]

exports.loginUserValidator = [
    body('email').isEmail().normalizeEmail().custom(value => {
        return User.findOne({email: value}).then(user => {
            if(!user){
                return Promise.reject('Invalid E-mail address')
            }
        })
    }),
    body('password').isLength({min: 5, max:50}),
]

exports.jwtTokenVerificationValidator = [
    body('token').isJWT()
]