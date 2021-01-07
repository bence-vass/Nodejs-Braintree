const jwt = require('jsonwebtoken');


class Authorization {

    static decodeToken = token => {
        return jwt.decode(token);
    }

    isAnonymous = async (req, res, next, options={
        redirect: null,
        token: req.headers.authorization,
    }) => {
        try{
            let decoded = Authorization.decodeToken(options.token)
            if(options.redirect){
                res.redirect(options.redirect)
            } else {
                throw new Error('User authenticated')
            }
        } catch (e) {
            next()
        }
    }

    isAuthenticated = async (req, res, next, options={
        redirect: null,
        token: req.headers.authorization,
    }) => {
        try{
            let decoded = Authorization.decodeToken(options.token)
            next()
        } catch (e) {
            if(options.redirect){
                res.redirect(options.redirect)
            } else {
                throw new Error('User unauthenticated')
            }
        }
    }
}

module.exports = Authorization