const {User} = require('../models/User')
const UserRegister = require('../utils/user/register')
let createError = require('http-errors');
const {decodeAccessToken, decodeRefreshToken, InputErrorMsg} = require("../utils/user/validation");


/**
 * --- Body inputs are validated in the router
 */


exports.createSession = async (req, res, next) => {
    try{
        let session = await UserRegister.createSession()
        res.status(200).json({
            status: 'success',
            sessionID: session._id,
            sessionExp: new Date(session.expireAt).getTime()
        })
    } catch (dbError) {
        res.status(200).json({status: 'error', response: dbError})
    }
}
/*
    Create a new user
    Validation:
    Inputs are validated in bodyInputValidator.registerUserValidator
    Success:
    return created User id
    Error:
    return thrown Error
 */
exports.registerUser = async (req, res, next) => {
    try{
        InputErrorMsg(req, res, next)
        const email = req.body.email
        const password = req.body.password
        let user = await UserRegister.createUser(email, password)
        console.log(user)
        res.status(200).json({status: 'success',  userID: user.id})
    } catch (error) {
        res.status(400).json({status: 'error',  error})

    }


}
exports.loginUser = async (req, res, next) => {
    try{
        InputErrorMsg(req, res)
        const email = req.body.email
        const password = req.body.password
        let [accessToken, refreshToken] = await UserRegister.loginUser(email, password)
        res.status(200).json({status: 'success',  accessToken: accessToken, refreshToken: refreshToken})
    } catch (error) {
        res.status(400).json({status: 'error',  error: "Invalid credentials"})
    }
}
exports.accessTokenVerification = async (req, res, next) => {
    const token = req.body.token
    try{
        let decoded = await decodeAccessToken(token)
        res.status(200).json({status: 'success',  valid: true, payload: decoded})
    } catch (tokenError) {
        res.status(400).json({status: 'error',  valid: false, error: tokenError})

    }
}
exports.refreshTokenVerification = async (req, res, next) => {
    const token = req.body.token
    try{
        let decoded = await decodeRefreshToken(token)
        res.status(200).json({status: 'success',  valid: true, payload: decoded})
    } catch (tokenError) {
        res.status(400).json({status: 'error',  valid: false, error: tokenError})

    }
}
exports.refreshAccessToken = async (req, res, next) => {
    const refreshToken = req.body.token
    try{
        let [newAccessToken, newRefreshToken] = await UserRegister.refreshUserAuth(refreshToken)
        res.status(200).json({status: 'success',  accessToken: newAccessToken, refreshToken: newRefreshToken})
    } catch (error) {
        res.status(400).json({status: 'error', error: error})
    }
}


exports.revokeRefreshToken = async (req, res, next) => {
    try{
        InputErrorMsg(req, res)
        const queryField = req.body.field
        const queryValue = req.body.value
        let result = await UserRegister.revokeRefreshToken(queryValue, queryField)
        res.status(200).json({result})
    } catch (revokeError) {
        console.log(revokeError)
        res.status(400).json({status: 'error',  error: revokeError})

    }

}

exports.userDetails = async (req, res, next) => {
    try{
        const token = req.headers.authorization
        let decoded = await decodeAccessToken(token)
        let user = await User.findById(decoded.sub)
        res.status(200).json({status: 'success',  user})
    } catch (error) {
        res.status(400).json({status: 'error', error: error})
    }
}

/*
exports.userByID = async (req, res, next) => {
    try{
        const userID = req.params.userID
        let user = await User.findById(userID)
        console.log(user)
        if(user.guest){
            res.status(200).json({status: 'success', sessionID: user._id})
        } else {
            res.status(200).json({status: 'success', response: user})
        }
    } catch (dbError) {
        res.status(200).json({status: 'error', response: dbError})
    }
}*/
