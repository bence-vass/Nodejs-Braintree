const Auth = require('./index')
const jwt = require('jsonwebtoken');
const {User, Session, RefreshToken} = require('../../models/User')

class JwtAuthentication extends Auth {
    constructor(options = {}) {
        super();
        const privateKeyENV = process.env.privateKey
        const publicKeyENV = process.env.publicKey
        if (privateKeyENV === undefined) throw "No env variable for private key"
        if (publicKeyENV === undefined) throw "No env variable for public key"
        this.privateKey = privateKeyENV
        this.publicKey = publicKeyENV
        this.expMin = options.expMin ? options.expMin : 20
    }

    /**
     * Create access token for user
     * @param user
     * @returns {Promise<Object>}
     */
    async generateAccessToken(user) {
        try {
            let accessTokenPayload = {
                sub: user.id,
                email: user.email,
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + (60 * 20),
            }
            console.log(accessTokenPayload)
            return await jwt.sign(accessTokenPayload, process.env.privateKey)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async generateRefreshToken(user) {
        try {
            let refreshTokenPayload = {
                sub: user.id,
                exp: Math.floor(Date.now() / 1000) + (60 * 25),
            }
            let refreshToken = await jwt.sign(refreshTokenPayload, process.env.privateKey)
            await new RefreshToken({
                token: refreshToken,
                user: user.id
            }).save()
            return refreshToken
        } catch (error) {
            throw error
        }
    }

    async revokeRefreshToken(value, field = 'token') {
        const validQueryFields = ['token', 'user', 'id']
        if (validQueryFields.includes(field)) {
            let token
            switch (field) {
                case "id": {
                    token = await RefreshToken.findByIdAndDelete(value).exec()
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

    async login(email, password) {
        try {
            let user = await this.loginUser(email, password)
            let token = await RefreshToken.findOne({user: user.id}).exec()
            if(token){
                console.log('revoked token: ', token.id)
                await this.revokeRefreshToken(token.id)
            }
            let accessToken = await this.generateAccessToken(user)
            let refreshToken = await this.generateRefreshToken(user)
            return {
                accessToken: accessToken,
                refreshToken: refreshToken,
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async refresh(refreshToken){
        try{
            let token = await RefreshToken.findOne({token: refreshToken})
            if(token){
                let user = await User.findById(token.user)
                await this.revokeRefreshToken(token.id, 'id')
                let newAccessToken = await this.generateAccessToken(user)
                let newRefreshToken = await this.generateRefreshToken(user)
                return {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                }
            }
            throw new Error('Invalid token')
        } catch (e) {
            throw new Error(e)
        }
    }
    async revoke(refreshToken){
        try{
            await this.revokeRefreshToken(refreshToken)
            return{
                status: 'success',
                text: 'Token revoked'
            }
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = JwtAuthentication