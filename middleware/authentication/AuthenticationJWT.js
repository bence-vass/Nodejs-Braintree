const jwt = require('jsonwebtoken')
const {decodeAccessToken} = require("../../utils/user/validation");
const {User} = require('../../models/User')


module.exports.isAnonymous = async (req, res, next, authToken=req.headers.authorization) => {
    try{
        let decoded = await decodeAccessToken(authToken)
        res.redirect('profile')
    } catch (e) {
        next()
    }
}

module.exports.isAuthenticated = async (req, res, next, authToken=req.headers.authorization) => {
    try {
        let decoded = await decodeAccessToken(authToken)
        next()
    } catch (authError) {
        res.status(401).json({status: 'error', authError});
        res.redirect('login')
    }
}
module.exports.isUserOwner = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        const userID = req.params.userID
        let decoded = await jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        console.log(decoded)
        try{
            let user = await User.findById(userID).exec()
            if(user.email === decoded.email){
                next()
            } else {
                res.status(401).json({status: 'error', error: 'No permission'});
            }
        } catch (dbError) {
            res.status(401).json({status: 'error', dbError});
        }
    } catch (authError) {
        res.status(401).json({status: 'error', authError});
    }
}

module.exports.isAdmin = async (req, res, next, authToken=req.headers.authorization) => {
    try {
        let decoded = await decodeAccessToken(authToken)
        if(decoded.role === 'ADMIN'){
            next()
        } else {
            res.status(401).json({status: 'error', error: 'No permission'});
        }
    } catch (authError) {
        res.status(401).json({status: 'error', authError});
        //res.redirect('login')

    }
}