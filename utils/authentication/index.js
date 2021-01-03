const bcrypt = require('bcryptjs');
const {User} = require('../../models/User')
const mongoose = require('../../mongooseConnect')

class Authentication {
    constructor() {

    }

    static hashPassword(password, salt = 10) {
        return bcrypt.hashSync(password, salt)
    }

    static verifyPassword(password, passwordHash) {
        return bcrypt.compareSync(password, passwordHash)
    }

    async createUser(email, password, options = {}) {
        try {
            let passwordHash = Authentication.hashPassword(password)
            let user = new User({
                email: email,
                password: passwordHash
            })
            await user.save()
            return user
        } catch (e) {
            console.error(e)
            throw 'Error creating user'
        }
    }

    async loginUser(email, password, options = {}) {
        try {
            let user = await User.findOne({email: email}).exec()
            if (user) {
                if (Authentication.verifyPassword(password, user.password)) {
                    return user
                }
                throw new Error('Invalid credentials')
            }
            throw new Error('Invalid Email address')

        } catch (e) {
            console.error(e)
            throw new Error(e)

        }
    }

    async updateInfoUser(){}
    async updateEmailUser(){}
    async updateEmailUser(forgotten=false){
        if(forgotten){

        } else {

        }
    }

}

module.exports = Authentication