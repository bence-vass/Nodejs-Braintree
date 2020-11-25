const {User, Session, RefreshToken} = require('../../models/User')
const jwt = require('jsonwebtoken');
const {decodeRefreshToken} = require("./validation");

/*
Create a User in db as guest, which will be deleted after 1h
 */
/**
 * Summary
 * Create a session in db
 *
 * @return {Object} Session
 */
module.exports.createSession = async function () {
    try {
        return await new Session({}).save()
    } catch (error) {
        return error
    }
}

/*
If the user wants to checkout as guest / do not want to register, updates the User in db
guest: false
expiresAt: null
email: !<emailAddress>
 */
/**
 * Summary
 * If the user wants to checkout as guest / do not want to register, updates the User in db
 *
 * Description
 * Update:
 * guest: false
 * expireAt: null
 * email: !<emailAddress>
 *
 * @param {String} email
 * @param {String} password
 * @return {Object} User
 */
exports.createUser = async function (email, password) {
    let user = new User({
        email: email,
        password: password,
    })
    try {
        await user.save()
        return user
    } catch (error) {
        throw error
    }
}


exports.loginUser = async function (email, password) {
    try {
        let user = await User.findOne({email: email}).exec()
        if (user.password === password) {
            await exports.revokeUsersTokens(user.id)
            let accessToken = await exports.generateAccessToken(user)
            let refreshToken = await exports.generateRefreshToken(user)
            return [accessToken, refreshToken.token]
        }
    } catch (dbError) {
        throw dbError
    }
}


exports.refreshUserAuth = async function (refreshToken) {
    try {
        let token = await RefreshToken.findOne({token: refreshToken})
        let decoded = await decodeRefreshToken(refreshToken)
        if (!!token && decoded.sub.toString() === token.user.toString()) {
            let user = await User.findById(token.user).exec()
            await RefreshToken.findByIdAndRemove(token.id)
            let accessToken = await exports.generateAccessToken(user)
            let refreshToken = await exports.generateRefreshToken(user)
            return [accessToken, refreshToken.token]
        }
        throw 'Invalid token'
    } catch (error) {
        throw error
    }

}

exports.revokeRefreshToken = async function (value, field = 'token') {
    const validQueryFields = ['token', 'user', 'id']
    if (validQueryFields.includes(field)) {
        let token
        switch (field) {
            case "id": {
                token = await RefreshToken.findById(value).remove().exec()
                break
            }
            case "user": {
                token = await RefreshToken.deleteOne({user: value}).exec()
                break
            }
            //handle queries by token
            default : {
                token = await RefreshToken.deleteOne({token: value}).exec()
                break
            }
        }
        if (!token) throw 'Invalid token'
        return token
    } else {
        throw 'Invalid query field, could not be revoked'
    }
}
exports.revokeUsersTokens = async function (userID) {
    try {
        return await RefreshToken.deleteMany({user: userID})
    } catch (error) {
        throw error
    }
}
exports.generateRefreshToken = async function (user) {
    try {
        let refreshTokenPayload = {
            sub: user.id,
            exp: Math.floor(Date.now() / 1000) + (60 * 25),
        }
        let refreshToken = await jwt.sign(refreshTokenPayload, process.env.JWT_REFRESH_PRIVATE_KEY)
        return await new RefreshToken({
            token: refreshToken,
            user: user.id
        }).save()
    } catch (error) {
        throw error
    }

}
exports.generateAccessToken = async function (user) {
    try {
        let accessTokenPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + (60 * 20),
        }
        return await jwt.sign(accessTokenPayload, process.env.JWT_ACCESS_PRIVATE_KEY)
    } catch (error) {
        throw error
    }

}